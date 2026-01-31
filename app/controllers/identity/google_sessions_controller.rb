# frozen_string_literal: true

require "google-id-token"

class Identity::GoogleSessionsController < InertiaController
  skip_before_action :authenticate, only: :create
  before_action :require_no_authentication, only: :create

  def create
    credential = params[:credential].to_s
    if credential.blank?
      redirect_to sign_in_path, alert: "Google sign-in failed"
      return
    end

    payload = validate_google_token(credential)
    unless payload
      redirect_to sign_in_path, alert: "Google sign-in failed"
      return
    end

    verified = payload["email_verified"] == true || payload["email_verified"].to_s == "true"
    unless verified
      redirect_to sign_in_path, alert: "Google sign-in failed"
      return
    end

    email = payload["email"].to_s.downcase
    if email.blank?
      redirect_to sign_in_path, alert: "Google sign-in failed"
      return
    end

    user = User.find_by(email: email) || build_google_user(payload, email, verified)

    unless user.persisted?
      user.save!
    end

    session_record = user.sessions.create!
    cookies.signed.permanent[:session_token] = {value: session_record.id, httponly: true}

    redirect_path = session.delete(:after_sign_in_path)
    redirect_path ||= user.admin? ? admin_dashboard_path : dashboard_path
    redirect_to redirect_path, notice: "Signed in successfully"
  rescue GoogleIDToken::ValidationError => e
    Rails.logger.warn("Google sign-in failed: #{e.message}")
    redirect_to sign_in_path, alert: "Google sign-in failed"
  end

  private

  def validate_google_token(credential)
    client_id = Rails.application.credentials.dig(:google, :client_id).to_s
    return if client_id.blank?

    validator = GoogleIDToken::Validator.new
    validator.check(credential, client_id)
  end

  def build_google_user(payload, email, verified)
    name = payload["name"].presence || payload["given_name"].presence || email.split("@").first
    display_name = payload["name"].presence || name
    password = SecureRandom.base64(24)

    User.new(
      email: email,
      name: name,
      display_name: display_name,
      avatar_url: payload["picture"],
      verified: verified,
      password: password,
      password_confirmation: password,
    )
  end
end
