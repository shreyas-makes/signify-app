# frozen_string_literal: true

class Extension::AuthController < InertiaController
  skip_before_action :authenticate
  before_action :ensure_extension_authentication

  def show
    context = extension_context
    if context[:error]
      render inertia: "extension/auth", props: { error: context[:error] }, status: :unprocessable_content
      return
    end

    render inertia: "extension/auth", props: {
      state: context[:state],
      redirect_uri: context[:redirect_uri]
    }
  end

  def create
    context = extension_context
    if context[:error]
      render inertia: "extension/auth", props: { error: context[:error] }, status: :unprocessable_content
      return
    end

    auth_code = Current.user.extension_auth_codes.create!(
      state: context[:state],
      redirect_uri: context[:redirect_uri]
    )

    session.delete(:after_sign_in_path)

    redirect_to build_redirect_uri(context[:redirect_uri], auth_code.code, context[:state]),
      allow_other_host: true
  end

  private

  def ensure_extension_authentication
    return if perform_authentication

    session[:after_sign_in_path] = extension_auth_path(
      state: params[:state],
      redirect_uri: params[:redirect_uri]
    )

    redirect_to sign_in_path
  end

  def extension_context
    redirect_uri = params[:redirect_uri].presence
    state = params[:state].presence

    return { error: "Missing redirect URI." } if redirect_uri.blank?

    unless allowed_redirect_uri?(redirect_uri)
      return { error: "Invalid extension redirect URI." }
    end

    { redirect_uri: redirect_uri, state: state }
  end

  def allowed_redirect_uri?(redirect_uri)
    uri = URI.parse(redirect_uri)
    return false unless uri.scheme == "chrome-extension"

    allowed = ENV.fetch("SIGNIFY_EXTENSION_REDIRECT_URIS", "")
      .split(",")
      .map(&:strip)
      .reject(&:empty?)

    return true if allowed.empty?

    allowed.include?(redirect_uri)
  rescue URI::InvalidURIError
    false
  end

  def build_redirect_uri(redirect_uri, code, state)
    uri = URI.parse(redirect_uri)
    params = Rack::Utils.parse_nested_query(uri.query)
    params["code"] = code
    params["state"] = state if state.present?
    uri.query = params.to_query
    uri.to_s
  end
end
