# frozen_string_literal: true

require "rails_helper"

RSpec.describe Document, type: :model do
  describe "associations" do
    it "belongs to user" do
      document = create(:document)
      expect(document.user).to be_present
    end

    it "has many keystrokes" do
      document = create(:document)
      keystroke = create(:keystroke, document: document)
      expect(document.keystrokes).to include(keystroke)
    end

    it "destroys dependent keystrokes when document is destroyed" do
      document = create(:document)
      keystroke = create(:keystroke, document: document)
      keystroke_id = keystroke.id
      document.destroy
      expect(Keystroke.exists?(keystroke_id)).to be false
    end
  end

  describe "validations" do
    let(:document) { build(:document) }

    it "validates presence of title" do
      document.title = nil
      expect(document).not_to be_valid
      expect(document.errors[:title]).to include("can't be blank")
    end

    it "validates maximum length of title" do
      document.title = "a" * 256
      expect(document).not_to be_valid
      expect(document.errors[:title]).to include("is too long (maximum is 255 characters)")
    end

    it "validates presence of slug" do
      document.slug = ""
      document.title = ""
      expect(document).not_to be_valid
      expect(document.errors[:slug]).to include("can't be blank")
    end

    it "validates uniqueness of slug" do
      create(:document, slug: "unique-slug")
      document.slug = "unique-slug"
      expect(document).not_to be_valid
      expect(document.errors[:slug]).to include("has already been taken")
    end

    it "validates presence of status" do
      document.status = nil
      expect(document).not_to be_valid
      expect(document.errors[:status]).to include("can't be blank")
    end

    it "validates slug format" do
      document.slug = "Invalid Slug!"
      expect(document).not_to be_valid
      expect(document.errors[:slug]).to include("is invalid")
    end

    it "accepts valid slug" do
      document.slug = "valid-slug-123"
      expect(document).to be_valid
    end
  end

  describe "enums" do
    it "defines status enum with correct values" do
      expect(Document.statuses).to eq({"draft" => 0, "published" => 1})
    end

    it "allows setting status to draft" do
      document = build(:document, status: :draft)
      expect(document.status).to eq("draft")
      expect(document).to be_draft
    end

    it "allows setting status to published" do
      document = build(:document, status: :published)
      expect(document.status).to eq("published")
      expect(document).to be_published
    end
  end

  describe "scopes" do
    let!(:draft_document) { create(:document, status: :draft) }
    let!(:published_document) { create(:document, status: :published) }

    describe ".published" do
      it "returns only published documents" do
        expect(Document.published).to contain_exactly(published_document)
      end
    end

    describe ".drafts" do
      it "returns only draft documents" do
        expect(Document.drafts).to contain_exactly(draft_document)
      end
    end
  end

  describe "slug generation" do
    context "when slug is blank" do
      it "generates slug from title" do
        document = build(:document, title: "Test Document", slug: nil)
        document.valid?
        expect(document.slug).to eq("test-document")
      end

      it "handles duplicate slugs" do
        create(:document, title: "Test Document", slug: "test-document")
        document = build(:document, title: "Test Document", slug: nil)
        document.valid?
        expect(document.slug).to eq("test-document-1")
      end

      it "handles special characters in title" do
        document = build(:document, title: "Test & Document #1!", slug: nil)
        document.valid?
        expect(document.slug).to eq("test-document-1")
      end
    end

    context "when slug is present" do
      it "does not override existing slug" do
        document = build(:document, title: "Test Document", slug: "custom-slug")
        document.valid?
        expect(document.slug).to eq("custom-slug")
      end
    end
  end

  describe "status changes" do
    let(:document) { create(:document, status: :draft) }

    it "can change from draft to published" do
      document.update!(status: :published)
      expect(document).to be_published
    end

    it "can change from published to draft" do
      document.update!(status: :published)
      document.update!(status: :draft)
      expect(document).to be_draft
    end
  end
end
