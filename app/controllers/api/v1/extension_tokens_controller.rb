# frozen_string_literal: true

class Api::V1::ExtensionTokensController < ApplicationController
  include Api::Cors

  protect_from_forgery with: :null_session

  skip_before_action :authenticate
  before_action :authenticate_extension_request!, except: :options
  after_action :set_cors_headers

  # POST /api/v1/extension_tokens
  def create
    code = params[:code].to_s
    state = params[:state].to_s.presence

    auth_code = ExtensionAuthCode.consume(code, state: state)
    unless auth_code
      render json: { error: "Invalid or expired code" }, status: :unauthorized
      return
    end

    user = auth_code.user
    token = user.api_token.presence || user.regenerate_api_token

    auth_code.redeem!

    render json: {
      token_type: "bearer",
      api_token: token
    }, status: :ok
  end

  # OPTIONS /api/v1/extension_tokens
  def options
    head :ok
  end

  private

  def authenticate_extension_request!
    return if params[:code].present?

    render json: { error: "Missing code" }, status: :unauthorized
  end

  def set_cors_headers
    apply_cors_headers(allowed_methods: "POST, OPTIONS")
  end
end
