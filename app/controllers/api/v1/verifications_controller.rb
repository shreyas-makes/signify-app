# frozen_string_literal: true

class Api::V1::VerificationsController < ApplicationController
  include Api::Cors

  protect_from_forgery with: :null_session

  skip_before_action :authenticate
  before_action :authenticate_api!, except: :options
  after_action :set_cors_headers

  # POST /api/v1/verifications
  def create
    keystrokes = verification_keystrokes
    verification = Current.user.verifications.new(verification_attributes)
    verification.status = verification.status_from_paste_events

    if verification.save
      process_keystrokes(verification, keystrokes)
      render json: {
        id: verification.public_id,
        status: verification.status,
        public_url: public_url_for(verification)
      }, status: :created
    else
      render json: {
        error: "Validation failed",
        details: verification.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # OPTIONS /api/v1/verifications
  def options
    head :ok
  end

  private

  def authenticate_api!
    return if perform_authentication

    user = authenticate_with_api_token
    if user
      Current.session = Session.new(user: user)
      return
    end

    render json: { error: "Unauthorized" }, status: :unauthorized
  end

  def verification_attributes
    attrs = params.require(:verification).permit(
      :platform,
      :content_hash,
      :start_at,
      :end_at,
      keystroke_stats: {},
      paste_events: {},
      paste: {}
    ).to_h

    paste = attrs.delete("paste")
    if paste.present?
      attrs["paste_events"] = paste.respond_to?(:to_h) ? paste.to_h : paste
    end

    attrs
  end

  def verification_keystrokes
    params.require(:verification)
      .permit(keystrokes: [
        :event_type,
        :key_code,
        :character,
        :timestamp,
        :sequence_number,
        :cursor_position
      ]).to_h["keystrokes"]
  end

  def process_keystrokes(verification, keystroke_data)
    return unless keystroke_data.is_a?(Array)

    # Limit the number of keystrokes processed at once
    keystroke_data = keystroke_data.first(5000) if keystroke_data.length > 5000

    keystroke_data.each do |keystroke_params|
      sanitized_params = sanitize_keystroke_params(keystroke_params)
      next unless sanitized_params

      unless verification.keystrokes.exists?(sequence_number: sanitized_params[:sequence_number])
        absolute_timestamp = resolve_timestamp(
          sanitized_params[:timestamp],
          verification.start_at
        )

        verification.keystrokes.create!(
          event_type: sanitized_params[:event_type],
          key_code: sanitized_params[:key_code],
          character: sanitized_params[:character],
          timestamp: absolute_timestamp,
          sequence_number: sanitized_params[:sequence_number],
          cursor_position: sanitized_params[:cursor_position]
        )
      end
    end

    verification.keystroke_stats = (verification.keystroke_stats || {}).merge(
      "total_keystrokes" => verification.keystrokes.count
    )
    verification.save!
  rescue => e
    Rails.logger.error "Error processing verification keystrokes: #{e.message}"
  end

  def sanitize_keystroke_params(params_hash)
    return nil unless params_hash.is_a?(Hash)

    event_type = params_hash[:event_type] || params_hash["event_type"]
    key_code = params_hash[:key_code] || params_hash["key_code"]
    character = params_hash[:character] || params_hash["character"]
    timestamp = params_hash[:timestamp] || params_hash["timestamp"]
    sequence_number = params_hash[:sequence_number] || params_hash["sequence_number"]
    cursor_position = params_hash[:cursor_position] || params_hash["cursor_position"]

    return nil if event_type.blank? || key_code.blank? || sequence_number.blank?

    {
      event_type: event_type,
      key_code: key_code.to_s,
      character: character,
      timestamp: timestamp.to_f,
      sequence_number: sequence_number.to_i,
      cursor_position: cursor_position.to_i
    }
  end

  def resolve_timestamp(value, start_at)
    numeric = value.to_f
    return Time.current if numeric <= 0

    if numeric > 10_000_000_000 # milliseconds since epoch
      Time.at(numeric / 1000.0)
    elsif numeric > 1_000_000_000 # seconds since epoch
      Time.at(numeric)
    elsif start_at.present?
      start_at + (numeric / 1000.0).seconds
    else
      Time.current - (numeric / 1000.0).seconds
    end
  end

  def public_url_for(verification)
    "#{request.base_url}/p/#{verification.public_id}"
  end

  def set_cors_headers
    apply_cors_headers(allowed_methods: "POST, OPTIONS")
  end

  def authenticate_with_api_token
    token = api_token_from_request
    return if token.blank?

    User.find_by(api_token: token)
  end

  def api_token_from_request
    auth_header = request.headers["Authorization"].to_s
    if auth_header.start_with?("Bearer ")
      return auth_header.delete_prefix("Bearer ").strip
    end

    request.headers["X-API-Token"].to_s.presence
  end
end
