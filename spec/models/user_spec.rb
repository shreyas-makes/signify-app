# frozen_string_literal: true

require "rails_helper"

RSpec.describe User, type: :model do
  describe "associations" do
    it "has many sessions" do
      user = create(:user)
      session = create(:session, user: user)
      expect(user.sessions).to include(session)
    end

    it "has many documents" do
      user = create(:user)
      document = create(:document, user: user)
      expect(user.documents).to include(document)
    end

    it "destroys dependent sessions when user is destroyed" do
      user = create(:user)
      session = create(:session, user: user)
      session_id = session.id
      user.destroy
      expect(Session.exists?(session_id)).to be false
    end

    it "destroys dependent documents when user is destroyed" do
      user = create(:user)
      document = create(:document, user: user)
      document_id = document.id
      user.destroy
      expect(Document.exists?(document_id)).to be false
    end
  end

  describe "validations" do
    let(:user) { build(:user) }

    it "validates presence of name" do
      user.name = nil
      expect(user).not_to be_valid
      expect(user.errors[:name]).to include("can't be blank")
    end

    it "validates presence of email" do
      user.email = nil
      expect(user).not_to be_valid
      expect(user.errors[:email]).to include("can't be blank")
    end

    it "validates uniqueness of email" do
      create(:user, email: "test@example.com")
      user.email = "test@example.com"
      expect(user).not_to be_valid
      expect(user.errors[:email]).to include("has already been taken")
    end

    it "validates presence of display_name" do
      user.display_name = nil
      expect(user).not_to be_valid
      expect(user.errors[:display_name]).to include("can't be blank")
    end

    it "validates length of display_name" do
      user.display_name = "a" * 101
      expect(user).not_to be_valid
      expect(user.errors[:display_name]).to include("is too long (maximum is 100 characters)")
    end

    it "validates minimum password length" do
      user.password = "short"
      expect(user).not_to be_valid
      expect(user.errors[:password]).to include("is too short (minimum is 12 characters)")
    end

    it "allows blank password for updates when password is not provided" do
      user = create(:user)
      user.name = "Updated Name"
      expect(user).to be_valid
    end

    it "validates email format" do
      user.email = "invalid-email"
      expect(user).not_to be_valid
      expect(user.errors[:email]).to include("is invalid")
    end

    it "accepts valid email" do
      user.email = "test@example.com"
      expect(user).to be_valid
    end
  end

  describe "normalization" do
    it "normalizes email to lowercase and strips whitespace" do
      user = create(:user, email: "  TEST@EXAMPLE.COM  ")
      expect(user.email).to eq("test@example.com")
    end
  end

  describe "secure password" do
    it "has secure password" do
      expect(User.new).to respond_to(:authenticate)
    end
  end

  describe "token generation" do
    let(:user) { create(:user) }

    it "generates email verification token" do
      token = user.generate_token_for(:email_verification)
      expect(token).to be_present
    end

    it "generates password reset token" do
      token = user.generate_token_for(:password_reset)
      expect(token).to be_present
    end
  end

  describe "callbacks" do
    context "when email changes" do
      it "sets verified to false on email update" do
        user = create(:user, verified: true)
        user.update(email: "new@example.com")
        expect(user.verified).to be false
      end
    end

    context "when password changes" do
      it "destroys other sessions after password update" do
        user = create(:user)
        session1 = create(:session, user: user)
        session2 = create(:session, user: user)

        allow(Current).to receive(:session).and_return(session1)

        user.update(password: "NewPassword123!")

        expect(Session.exists?(session1.id)).to be true
        expect(Session.exists?(session2.id)).to be false
      end
    end
  end
end
