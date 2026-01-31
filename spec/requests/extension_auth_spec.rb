# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Extension Auth", type: :request do
  let(:user) do
    User.create!(
      name: "Extension User",
      email: "extension@example.com",
      password: "secure_password",
      display_name: "Extension User"
    )
  end

  let(:redirect_uri) { "chrome-extension://ldhnipnockdjddnkmedmooobhkghddee/auth.html" }

  before do
    ENV["SIGNIFY_EXTENSION_REDIRECT_URIS"] = redirect_uri
  end

  after do
    ENV.delete("SIGNIFY_EXTENSION_REDIRECT_URIS")
  end

  it "renders the extension confirmation page" do
    sign_in_as(user)

    get extension_auth_path, params: { state: "state123", redirect_uri: redirect_uri }, headers: {
      "X-Inertia" => "true",
      "X-Inertia-Version" => ViteRuby.digest
    }

    expect(response).to have_http_status(:ok)

    payload = JSON.parse(response.body)
    expect(payload["component"]).to eq("extension/auth")
    expect(payload["props"]["state"]).to eq("state123")
    expect(payload["props"]["redirect_uri"]).to eq(redirect_uri)
  end

  it "rejects invalid redirect URIs" do
    sign_in_as(user)

    get extension_auth_path, params: { redirect_uri: "https://example.com/callback" }, headers: {
      "X-Inertia" => "true",
      "X-Inertia-Version" => ViteRuby.digest
    }

    expect(response).to have_http_status(:unprocessable_content)
    payload = JSON.parse(response.body)
    expect(payload["props"]["error"]).to be_present
  end

  it "issues a code and redirects back to the extension" do
    sign_in_as(user)

    expect {
      post extension_auth_path, params: { state: "state123", redirect_uri: redirect_uri }
    }.to change(ExtensionAuthCode, :count).by(1)

    expect(response).to have_http_status(:found)
    expect(response.headers["Location"]).to include("chrome-extension://ldhnipnockdjddnkmedmooobhkghddee/auth.html")
    expect(response.headers["Location"]).to include("code=")
    expect(response.headers["Location"]).to include("state=state123")
  end
end
