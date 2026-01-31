# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Public User Feeds", type: :request do
  let(:user) do
    User.create!(
      name: "Feed User",
      email: "feed@example.com",
      password: "secure_password",
      display_name: "Feed User"
    )
  end

  it "renders the public user feed page" do
    user.verifications.create!(
      platform: "twitter",
      content_hash: "hash321",
      paste_events: { occurred: false, count: 0 }
    )

    get public_user_feed_path(user.username), headers: {
      "X-Inertia" => "true",
      "X-Inertia-Version" => ViteRuby.digest
    }

    expect(response).to have_http_status(:ok)

    payload = JSON.parse(response.body)
    expect(payload["component"]).to eq("public/user_feeds/show")
    expect(payload["props"]["user"]["username"]).to eq(user.username)
    expect(payload["props"]["verifications"].length).to eq(1)
  end

  it "returns 404 for unknown user" do
    get public_user_feed_path("missing-user"), headers: {
      "X-Inertia" => "true",
      "X-Inertia-Version" => ViteRuby.digest
    }

    expect(response).to have_http_status(:not_found)
  end
end
