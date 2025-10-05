# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Users", type: :request do
  describe "GET /sign_up" do
    it "returns http success" do
      get sign_up_url
      expect(response).to have_http_status(:success)
    end
  end

  describe "POST /sign_up" do
    it "creates a new user and redirects to the dashboard" do
      user_params = attributes_for(:user)
      expect { post sign_up_url, params: user_params }.to change(User, :count).by(1)

      user = User.last
      expect(user.name).to eq(user_params[:name])
      expect(user.email).to eq(user_params[:email])
      expect(user.display_name).to eq(user_params[:display_name])
      expect(response).to redirect_to(dashboard_url)
    end

    it "creates a session for the new user" do
      user_params = attributes_for(:user)
      expect { post sign_up_url, params: user_params }.to change(Session, :count).by(1)

      expect(response.cookies["session_token"]).to be_present
    end

    it "requires display_name" do
      user_params = attributes_for(:user).except(:display_name)
      post sign_up_url, params: user_params

      expect(response).to redirect_to(sign_up_url)
      expect(User.count).to eq(0)
    end

    it "validates display_name length" do
      user_params = attributes_for(:user, display_name: "a" * 101)
      post sign_up_url, params: user_params

      expect(response).to redirect_to(sign_up_url)
      expect(User.count).to eq(0)
    end
  end
end
