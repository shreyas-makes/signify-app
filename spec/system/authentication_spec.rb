# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Authentication", type: :system do
  before do
    driven_by(:selenium_headless)
  end

  describe "User registration" do
    it "allows new users to register with display name" do
      visit sign_up_path

      fill_in "name", with: "John Doe"
      fill_in "display_name", with: "johndoe"
      fill_in "email", with: "john@example.com"
      fill_in "password", with: "Secret1*3*5*"
      fill_in "password_confirmation", with: "Secret1*3*5*"

      click_button "Create account"

      expect(page).to have_current_path(dashboard_path)
      expect(page).to have_content("Welcome! You have signed up successfully")

      user = User.last
      expect(user.name).to eq("John Doe")
      expect(user.display_name).to eq("johndoe")
      expect(user.email).to eq("john@example.com")
    end

    it "shows validation errors for missing display name" do
      visit sign_up_path

      fill_in "name", with: "John Doe"
      fill_in "email", with: "john@example.com"
      fill_in "password", with: "Secret1*3*5*"
      fill_in "password_confirmation", with: "Secret1*3*5*"

      click_button "Create account"

      expect(page).to have_current_path(sign_up_path)
      expect(User.count).to eq(0)
    end
  end

  describe "User sign in" do
    let(:user) { create(:user, email: "john@example.com", password: "Secret1*3*5*") }

    it "allows users to sign in with valid credentials" do
      visit sign_in_path

      fill_in "email", with: user.email
      fill_in "password", with: "Secret1*3*5*"

      click_button "Log in"

      expect(page).to have_current_path(dashboard_path)
      expect(page).to have_content("Signed in successfully")
    end

    it "shows error for invalid credentials" do
      visit sign_in_path

      fill_in "email", with: user.email
      fill_in "password", with: "wrongpassword"

      click_button "Log in"

      expect(page).to have_current_path(sign_in_path)
      expect(page).to have_content("That email or password is incorrect")
    end
  end

  describe "Authentication protection" do
    it "redirects unauthenticated users to sign in" do
      visit dashboard_path

      expect(page).to have_current_path(sign_in_path)
    end

    it "allows authenticated users to access protected pages" do
      user = create(:user)
      sign_in_as(user)

      visit dashboard_path

      expect(page).to have_current_path(dashboard_path)
    end
  end
end