# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Public Post Viewing", type: :system do
  let(:user) { create(:user) }
  let(:document) { create(:document, :published, user: user, word_count: 100, keystroke_count: 500) }

  before do
    driven_by(:selenium, using: :headless_chrome)
  end

  describe "viewing a published post" do
    it "displays the post with verification information" do
      visit public_post_path(document.public_slug)

      # Debug: Check what's actually on the page
      puts "Current URL: #{current_url}"
      puts "Page title: #{page.title}"
      puts "Page has content: #{page.has_content?('Document')}"
      
      # Wait for page to load
      expect(page).to have_css("body", wait: 10)

      # Article content and metadata
      expect(page).to have_content(document.title)
      expect(page).to have_content(document.content)
      expect(page).to have_content(user.display_name)
      expect(page).to have_content("#{document.word_count} words")
      expect(page).to have_content("#{document.reading_time_minutes} min read")

      # Verification section
      expect(page).to have_content("Human Verified")
      expect(page).to have_content("#{document.keystroke_count} verified keystrokes")
      expect(page).to have_content("Real-time verification")
      expect(page).to have_content("Every keystroke tracked")
      expect(page).to have_content("Tamper-proof")

      # Keystroke timeline link
      expect(page).to have_button("View Keystroke Timeline")

      # Social sharing buttons
      expect(page).to have_button("Twitter")
      expect(page).to have_button("LinkedIn")
      expect(page).to have_button("Facebook")
      expect(page).to have_button("Copy Link")

      # Author section
      expect(page).to have_content("Verified Writer")
      expect(page).to have_content("Human-verified content")
      expect(page).to have_content("Keystroke authenticated")
    end

    it "shows proper meta tags for social sharing" do
      visit public_post_path(document.public_slug)

      expect(page).to have_meta_property("og:title", document.title)
      expect(page).to have_meta_property("og:type", "article")
      expect(page).to have_meta_property("og:url", public_post_url(document.public_slug))
      expect(page).to have_meta_property("article:author", user.display_name)
    end

    it "handles keystroke timeline navigation" do
      visit public_post_path(document.public_slug)

      click_button "View Keystroke Timeline"

      expect(page).to have_current_path("/posts/#{document.public_slug}/keystrokes")
    end

    it "handles social sharing interactions" do
      visit public_post_path(document.public_slug)

      # Test copy link functionality
      click_button "Copy Link"
      expect(page).to have_button("Copied!")

      # Wait for text to reset
      sleep 2.1
      expect(page).to have_button("Copy Link")
    end

    it "shows reading progress indicator" do
      visit public_post_path(document.public_slug)

      # Check that progress bar exists
      expect(page).to have_css(".fixed.top-0.left-0.h-1.bg-blue-600")
    end

    it "has proper accessibility features" do
      visit public_post_path(document.public_slug)

      # Check semantic HTML and ARIA labels
      expect(page).to have_css("article[role='main'][aria-label='Article content']")
      expect(page).to have_css("h1")
      expect(page).to have_css("meta[name='viewport']")
    end

    it "handles navigation back to posts index" do
      visit public_post_path(document.public_slug)

      click_button "Back to Posts"
      expect(page).to have_current_path("/posts")

      visit public_post_path(document.public_slug)
      click_button "Explore More Posts"
      expect(page).to have_current_path("/posts")
    end
  end

  describe "when post is not found" do
    it "shows 404 page" do
      visit public_post_path("non-existent-slug")

      expect(page).to have_http_status(:not_found)
    end
  end

  describe "responsive design" do
    it "works on mobile viewport" do
      page.driver.browser.manage.window.resize_to(375, 667) # iPhone SE size

      visit public_post_path(document.public_slug)

      expect(page).to have_content(document.title)
      expect(page).to have_content("Human Verified")
      expect(page).to have_button("View Keystroke Timeline")

      # Check that verification section stacks properly on mobile
      expect(page).to have_css(".flex-col.sm\\:flex-row")
    end
  end

  private

  def have_meta_property(property, content)
    have_css("meta[property='#{property}'][content='#{content}']", visible: false)
  end
end