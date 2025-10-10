# frozen_string_literal: true

class Api::V1::VerificationController < ApplicationController
  skip_before_action :authenticate
  before_action :set_post
  before_action :apply_rate_limiting
  after_action :set_cors_headers

  # GET /api/v1/posts/:public_slug/verify
  # Returns verification analysis and integrity checks
  def show
    unless @post
      render json: { error: "Post not found" }, status: :not_found
      return
    end

    verification_service = KeystrokeVerificationService.new(@post)
    verification_data = verification_service.verify

    render json: verification_data
  end

  private

  def set_post
    @post = Document.published.find_by(public_slug: params[:public_slug])
  end

  def apply_rate_limiting
    # Simple rate limiting: 20 requests per minute per IP for verification
    cache_key = "verification_rate_limit:#{request.remote_ip}"
    current_count = Rails.cache.read(cache_key) || 0
    
    if current_count >= 20
      render json: { 
        error: "Rate limit exceeded. Maximum 20 requests per minute." 
      }, status: :too_many_requests
      return
    end
    
    Rails.cache.write(cache_key, current_count + 1, expires_in: 1.minute)
  end

  def set_cors_headers
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
  end

end