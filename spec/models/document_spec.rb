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
      document.define_singleton_method(:set_default_status) { nil } # Prevent callback
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
      expect(Document.statuses).to eq({"draft" => 0, "ready_to_publish" => 1, "published" => 2})
    end

    it "allows setting status to draft" do
      document = build(:document, status: :draft)
      expect(document.status).to eq("draft")
      expect(document).to be_draft
    end

    it "allows setting status to ready_to_publish" do
      document = build(:document, status: :ready_to_publish)
      expect(document.status).to eq("ready_to_publish")
      expect(document).to be_ready_to_publish
    end

    it "allows setting status to published" do
      document = build(:document, status: :published)
      expect(document.status).to eq("published")
      expect(document).to be_published
    end
  end

  describe "scopes" do
    let!(:draft_document) { create(:document, status: :draft) }
    let!(:ready_document) { create(:document, status: :ready_to_publish) }
    let!(:published_document) { create(:document, :published) }

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

    describe ".ready_to_publish" do
      it "returns only ready_to_publish documents" do
        expect(Document.ready_to_publish).to contain_exactly(ready_document)
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

    it "can change from draft to ready_to_publish" do
      document.update!(status: :ready_to_publish)
      expect(document).to be_ready_to_publish
    end

    it "can change from ready_to_publish to published" do
      document.update!(status: :ready_to_publish)
      document.update!(status: :published)
      expect(document).to be_published
    end

    it "can change from draft to published directly" do
      document.update!(status: :published)
      expect(document).to be_published
    end
  end

  describe "publishing-related validations" do
    describe "public_slug validation" do
      it "validates uniqueness of public_slug" do
        create(:document, public_slug: "unique-public-slug")
        document = build(:document, public_slug: "unique-public-slug")
        expect(document).not_to be_valid
        expect(document.errors[:public_slug]).to include("has already been taken")
      end

      it "allows nil public_slug" do
        document = build(:document, public_slug: nil)
        expect(document).to be_valid
      end

      it "validates public_slug format" do
        document = build(:document, public_slug: "Invalid Slug!")
        expect(document).not_to be_valid
        expect(document.errors[:public_slug]).to include("is invalid")
      end
    end

    describe "published document validations" do
      it "requires published_at when published" do
        document = create(:document, :published)
        document.update_column(:published_at, nil) # Bypass callbacks and validations
        document.reload
        expect(document).not_to be_valid
        expect(document.errors[:published_at]).to include("can't be blank")
      end

      it "requires public_slug when published" do
        document = create(:document, :published)
        document.update_column(:public_slug, nil) # Bypass callbacks and validations
        document.reload
        expect(document).not_to be_valid
        expect(document.errors[:public_slug]).to include("can't be blank")
      end

      it "allows editing published documents" do
        document = create(:document, :published, title: "Original", content: "Original content")

        document.update!(title: "Changed", content: "<p>Changed content</p>")
        document.reload

        expect(document.title).to eq("Changed")
        expect(document.content).to eq("<p>Changed content</p>")
      end
    end

    describe "count validations" do
      it "validates word_count is non-negative" do
        document = build(:document, word_count: -1)
        expect(document).not_to be_valid
        expect(document.errors[:word_count]).to include("must be greater than or equal to 0")
      end

      it "validates reading_time_minutes is non-negative" do
        document = build(:document, reading_time_minutes: -1)
        expect(document).not_to be_valid
        expect(document.errors[:reading_time_minutes]).to include("must be greater than or equal to 0")
      end

      it "validates keystroke_count is non-negative" do
        document = build(:document, keystroke_count: -1)
        expect(document).not_to be_valid
        expect(document.errors[:keystroke_count]).to include("must be greater than or equal to 0")
      end
    end
  end

  describe "content analysis methods" do
    let(:document) { build(:document, content: "This is a test document with exactly ten words here.") }

    describe "#calculate_word_count" do
      it "counts words correctly" do
        expect(document.calculate_word_count).to eq(10)
      end

      it "handles empty content" do
        document.content = ""
        expect(document.calculate_word_count).to eq(0)
      end

      it "handles nil content" do
        document.content = nil
        expect(document.calculate_word_count).to eq(0)
      end

      it "handles multiple spaces" do
        document.content = "Word    with    multiple    spaces"
        expect(document.calculate_word_count).to eq(4)
      end
    end

    describe "#calculate_reading_time" do
      it "calculates reading time based on 200 words per minute" do
        document.content = "word " * 200
        expect(document.calculate_reading_time).to eq(1)
      end

      it "rounds up partial minutes" do
        document.content = "word " * 250
        expect(document.calculate_reading_time).to eq(2)
      end

      it "returns 0 for empty content" do
        document.content = ""
        expect(document.calculate_reading_time).to eq(0)
      end
    end

    describe "#calculate_keystroke_count" do
      it "counts associated keystrokes" do
        document = create(:document)
        create_list(:keystroke, 5, document: document)
        expect(document.calculate_keystroke_count).to eq(5)
      end

      it "returns 0 when no keystrokes" do
        document = create(:document)
        expect(document.calculate_keystroke_count).to eq(0)
      end
    end

    describe "#content_statistics" do
      it "returns hash with all statistics" do
        document = create(:document, content: "Test content")
        create_list(:keystroke, 5, document: document)
        document.save! # Trigger content statistics update
        stats = document.content_statistics
        
        expect(stats[:word_count]).to eq(2)
        expect(stats[:reading_time_minutes]).to eq(1)
        expect(stats[:keystroke_count]).to eq(5)
        expect(stats[:character_count]).to eq(12)
      end
    end
  end

  describe "public slug generation" do
    context "when status changes to published" do
      it "generates public_slug from title" do
        document = create(:document, title: "Test Document", status: :draft)
        document.update!(status: :published)
        expect(document.public_slug).to eq("test-document")
      end

      it "handles duplicate public slugs" do
        create(:document, :published, title: "Test Document", public_slug: "test-document")
        document = create(:document, title: "Test Document", status: :draft)
        document.update!(status: :published)
        expect(document.public_slug).to eq("test-document-1")
      end

      it "excludes current document from uniqueness check" do
        document = create(:document, :published, title: "Test Document", public_slug: "test-document")
        document.save!
        expect(document.public_slug).to eq("test-document")
      end
    end
  end

  describe "callbacks" do
    describe "on save" do
      it "sets published_at when transitioning to published" do
        document = create(:document, status: :draft)
        expect(document.published_at).to be_nil
        
        document.update!(status: :published)
        expect(document.published_at).to be_present
        expect(document.published_at).to be_within(1.second).of(Time.current)
      end

      it "updates content statistics on save" do
        document = create(:document, content: "Test content with five words")
        document.reload
        expect(document.word_count).to eq(5)
        expect(document.reading_time_minutes).to eq(1)
      end

      it "sets default counts for new records" do
        document = Document.new(title: "Test", user: create(:user))
        document.valid?
        expect(document.word_count).to eq(0)
        expect(document.reading_time_minutes).to eq(0)
        expect(document.keystroke_count).to eq(0)
      end
    end
  end
end
