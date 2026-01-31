# frozen_string_literal: true

module Api
  module Cors
    DEFAULT_ALLOWED_HEADERS = "Content-Type, Authorization, X-API-Token".freeze

    private

    def apply_cors_headers(allowed_methods:)
      allowed_origin = cors_allowed_origin
      return if allowed_origin.nil?

      response.headers["Access-Control-Allow-Origin"] = allowed_origin
      response.headers["Access-Control-Allow-Methods"] = allowed_methods
      response.headers["Access-Control-Allow-Headers"] = cors_allowed_headers

      if cors_vary_origin?
        response.headers["Vary"] = "Origin"
      end
    end

    def cors_allowed_headers
      ENV.fetch("SIGNIFY_CORS_ALLOWED_HEADERS", DEFAULT_ALLOWED_HEADERS)
    end

    def cors_allowed_origin
      origin = request.headers["Origin"]
      return "*" if origin.blank?

      allowed = cors_allowed_origins
      return "*" if allowed.empty?

      allowed.include?(origin) ? origin : nil
    end

    def cors_allowed_origins
      ENV.fetch("SIGNIFY_EXTENSION_ORIGINS", "")
        .split(",")
        .map(&:strip)
        .reject(&:empty?)
    end

    def cors_vary_origin?
      origin = request.headers["Origin"]
      origin.present? && cors_allowed_origins.include?(origin)
    end
  end
end
