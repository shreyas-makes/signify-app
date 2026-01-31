# frozen_string_literal: true

require "rails_helper"

RSpec.describe "API Verifications", type: :request do
  let(:user) { User.create!(name: "Test User", email: "test@example.com", password: "secure_password", display_name: "Test User") }

  describe "POST /api/v1/verifications" do
    it "creates a verification for an authenticated user" do
      sign_in_as(user)

      payload = {
        verification: {
          platform: "twitter",
          content_hash: "abc123",
          keystroke_stats: { total_keystrokes: 42, duration_ms: 15000 },
          paste: { occurred: false, count: 0 },
          start_at: "2026-01-31T12:00:00Z",
          end_at: "2026-01-31T12:01:00Z"
        }
      }

      expect {
        post "/api/v1/verifications",
          params: payload.to_json,
          headers: { "Content-Type" => "application/json" }
      }.to change(Verification, :count).by(1)

      expect(response).to have_http_status(:created)

      body = JSON.parse(response.body)
      expect(body["status"]).to eq("human_written")
      expect(body["id"]).to be_present
      expect(body["public_url"]).to include("/p/")
    end

    it "creates a verification with a bearer token" do
      user.regenerate_api_token
      payload = {
        verification: {
          platform: "twitter",
          content_hash: "token123",
          keystroke_stats: { total_keystrokes: 3 },
          paste: { occurred: false, count: 0 }
        }
      }

      expect {
        post "/api/v1/verifications",
          params: payload.to_json,
          headers: {
            "Content-Type" => "application/json",
            "Authorization" => "Bearer #{user.api_token}"
          }
      }.to change(Verification, :count).by(1)

      expect(response).to have_http_status(:created)
    end

    it "creates a verification with an API token header" do
      user.regenerate_api_token
      payload = {
        verification: {
          platform: "twitter",
          content_hash: "header123",
          keystroke_stats: { total_keystrokes: 3 },
          paste: { occurred: false, count: 0 }
        }
      }

      expect {
        post "/api/v1/verifications",
          params: payload.to_json,
          headers: {
            "Content-Type" => "application/json",
            "X-API-Token" => user.api_token
          }
      }.to change(Verification, :count).by(1)

      expect(response).to have_http_status(:created)
    end

    it "rejects unauthenticated requests" do
      payload = {
        verification: {
          platform: "twitter",
          content_hash: "abc123",
          keystroke_stats: {},
          paste: { occurred: false, count: 0 }
        }
      }

      post "/api/v1/verifications",
        params: payload.to_json,
        headers: { "Content-Type" => "application/json" }

      expect(response).to have_http_status(:unauthorized)
    end

    it "stores keystrokes and marks mixed when paste occurred" do
      sign_in_as(user)

      payload = {
        verification: {
          platform: "twitter",
          content_hash: "paste123",
          paste: { occurred: true, count: 1 },
          keystrokes: [
            { event_type: "keydown", key_code: "KeyA", character: "a", timestamp: 1000, sequence_number: 1, cursor_position: 0 },
            { event_type: "keyup", key_code: "KeyA", character: "a", timestamp: 1100, sequence_number: 2, cursor_position: 1 }
          ]
        }
      }

      expect {
        post "/api/v1/verifications",
          params: payload.to_json,
          headers: { "Content-Type" => "application/json" }
      }.to change(Verification, :count).by(1)

      verification = Verification.order(created_at: :desc).first
      expect(verification.status).to eq("mixed")
      expect(verification.keystrokes.count).to eq(2)
    end

    it "includes CORS headers on create responses" do
      sign_in_as(user)

      payload = {
        verification: {
          platform: "twitter",
          content_hash: "abc123",
          keystroke_stats: {},
          paste: { occurred: false, count: 0 }
        }
      }

      post "/api/v1/verifications",
        params: payload.to_json,
        headers: { "Content-Type" => "application/json" }

      expect(response.headers["Access-Control-Allow-Origin"]).to eq("*")
      expect(response.headers["Access-Control-Allow-Methods"]).to include("POST")
      expect(response.headers["Access-Control-Allow-Headers"]).to include("Authorization")
    end
  end

  describe "OPTIONS /api/v1/verifications" do
    it "returns CORS headers for preflight requests" do
      options "/api/v1/verifications"

      expect(response).to have_http_status(:ok)
      expect(response.headers["Access-Control-Allow-Origin"]).to eq("*")
      expect(response.headers["Access-Control-Allow-Methods"]).to include("OPTIONS")
      expect(response.headers["Access-Control-Allow-Headers"]).to include("Authorization")
    end

    it "returns CORS headers for allowed origins" do
      original = ENV["SIGNIFY_EXTENSION_ORIGINS"]
      ENV["SIGNIFY_EXTENSION_ORIGINS"] = "chrome-extension://testid"

      options "/api/v1/verifications", headers: {
        "Origin" => "chrome-extension://testid"
      }

      expect(response).to have_http_status(:ok)
      expect(response.headers["Access-Control-Allow-Origin"]).to eq("chrome-extension://testid")
      expect(response.headers["Access-Control-Allow-Headers"]).to include("Authorization")
    ensure
      ENV["SIGNIFY_EXTENSION_ORIGINS"] = original
    end
  end
end
