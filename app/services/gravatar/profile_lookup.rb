# frozen_string_literal: true

require "net/http"
require "json"

module Gravatar
  class ProfileLookup
    CACHE_TTL = 12.hours
    API_BASE = "https://api.gravatar.com/v3"

    def initialize(identifier)
      @identifier = identifier.to_s.strip
    end

    def avatar_url
      return if @identifier.blank?

      Rails.cache.fetch(cache_key, expires_in: CACHE_TTL) do
        fetch_avatar_url
      end
    rescue StandardError => error
      Rails.logger.warn("Gravatar profile lookup failed: #{error.class} #{error.message}")
      nil
    end

    private

    def cache_key
      "gravatar:profile:#{@identifier}"
    end

    def fetch_avatar_url
      api_key = ENV.fetch("GRAVATAR_API_KEY", "").to_s
      return if api_key.blank?

      uri = URI("#{API_BASE}/profiles/#{@identifier}")
      request = Net::HTTP::Get.new(uri)
      request["Authorization"] = "Bearer #{api_key}"
      request["Content-Type"] = "application/json"

      response = Net::HTTP.start(uri.host, uri.port, use_ssl: true) do |http|
        http.request(request)
      end

      return unless response.is_a?(Net::HTTPSuccess)

      body = JSON.parse(response.body)
      body["avatar_url"]
    end
  end
end
