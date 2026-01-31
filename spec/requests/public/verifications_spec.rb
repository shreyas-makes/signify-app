# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Public Verifications", type: :request do
  let(:user) do
    User.create!(
      name: "Test User",
      email: "test-public@example.com",
      password: "secure_password",
      display_name: "Test User"
    )
  end

  it "renders the public verification page" do
    verification = user.verifications.create!(
      platform: "twitter",
      content_hash: "hash123",
      paste_events: { occurred: false, count: 0 }
    )

    Keystroke.create!(
      verification: verification,
      event_type: :keydown,
      key_code: "KeyA",
      character: "a",
      timestamp: Time.current,
      cursor_position: 0,
      sequence_number: 1
    )

    get public_verification_path(verification.public_id), headers: {
      "X-Inertia" => "true",
      "X-Inertia-Version" => ViteRuby.digest
    }

    expect(response).to have_http_status(:ok)

    payload = JSON.parse(response.body)
    expect(payload["component"]).to eq("public/verifications/show")
    expect(payload["props"]["verification"]["id"]).to eq(verification.public_id)
    expect(payload["props"]["keystrokes"].length).to eq(1)
  end

  it "returns 404 for unknown verification" do
    get public_verification_path("missing"), headers: {
      "X-Inertia" => "true",
      "X-Inertia-Version" => ViteRuby.digest
    }

    expect(response).to have_http_status(:not_found)
  end
end
