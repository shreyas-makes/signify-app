# frozen_string_literal: true

module AuthenticationHelpers
  extend ActiveSupport::Concern

  def sign_in_as(user)
    session = user.sessions.create!

    if respond_to?(:request) && request.respond_to?(:cookie_jar)
      # For request specs
      request.cookie_jar.signed[:session_token] = session.id
    else
      # Fallback: create the cookie manually for tests
      jar = ActionDispatch::Request.new(Rails.application.env_config).cookie_jar
      jar.signed[:session_token] = session.id
      cookies[:session_token] = jar[:session_token] if respond_to?(:cookies)
    end
  end

  def sign_out
    request = ActionDispatch::Request.new(Rails.application.env_config)
    cookies = request.cookie_jar
    cookies.delete(:session_token)
  end
end
