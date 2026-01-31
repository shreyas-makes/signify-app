# frozen_string_literal: true

require "rails_helper"

RSpec.describe "API Extension Tokens", type: :request do
  let(:user) do
    User.create!(
      name: "Token User",
      email: "token@example.com",
      password: "secure_password",
      display_name: "Token User"
    )
  end

  let(:redirect_uri) { "chrome-extension://ldhnipnockdjddnkmedmooobhkghddee/auth.html" }

  it "exchanges a valid code for an API token" do
    auth_code = user.extension_auth_codes.create!(
      code: "code123",
      state: "state123",
      redirect_uri: redirect_uri,
      expires_at: 5.minutes.from_now
    )

    post "/api/v1/extension_tokens", params: { code: auth_code.code, state: "state123" }

    expect(response).to have_http_status(:ok)

    body = JSON.parse(response.body)
    expect(body["token_type"]).to eq("bearer")
    expect(body["api_token"]).to be_present

    auth_code.reload
    expect(auth_code.redeemed_at).to be_present
  end

  it "rejects expired codes" do
    auth_code = user.extension_auth_codes.create!(
      code: "expired123",
      redirect_uri: redirect_uri,
      expires_at: 1.minute.ago
    )

    post "/api/v1/extension_tokens", params: { code: auth_code.code }

    expect(response).to have_http_status(:unauthorized)
  end

  it "rejects reused codes" do
    auth_code = user.extension_auth_codes.create!(
      code: "used123",
      redirect_uri: redirect_uri,
      expires_at: 5.minutes.from_now,
      redeemed_at: Time.current
    )

    post "/api/v1/extension_tokens", params: { code: auth_code.code }

    expect(response).to have_http_status(:unauthorized)
  end

  it "rejects state mismatch" do
    auth_code = user.extension_auth_codes.create!(
      code: "state123",
      state: "expected",
      redirect_uri: redirect_uri,
      expires_at: 5.minutes.from_now
    )

    post "/api/v1/extension_tokens", params: { code: auth_code.code, state: "wrong" }

    expect(response).to have_http_status(:unauthorized)
  end
end
