# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Keystroke Visualization", type: :system do
  let(:user) { create(:user) }
  let(:document) { create(:document, :published, user: user) }
  
  before do
    # Create sample keystrokes for the document
    create_list(:keystroke, 50, document: document) do |keystroke, index|
      keystroke.sequence_number = index + 1
      keystroke.timestamp = Time.current - 1.hour + (index * 2).seconds
      keystroke.cursor_position = index
    end
  end

  describe "keystroke timeline page" do
    before do
      visit public_post_keystrokes_path(document.public_slug)
    end

    it "displays the keystroke visualization interface" do
      expect(page).to have_content("Keystroke Timeline: #{document.title}")
      expect(page).to have_content("Human Verified")
      expect(page).to have_content("Keystroke Replay")
    end

    it "shows verification statistics" do
      expect(page).to have_content("Keystrokes")
      expect(page).to have_content("Avg WPM")
      expect(page).to have_content("Total Time")
      expect(page).to have_content("Pauses")
      expect(page).to have_content("Corrections")
    end

    it "displays replay controls" do
      expect(page).to have_button("Play")
      expect(page).to have_button("Reset")
      expect(page).to have_button("Download Data")
      expect(page).to have_content("Speed:")
      expect(page).to have_button("1x")
      expect(page).to have_button("2x")
      expect(page).to have_button("5x")
      expect(page).to have_button("10x")
    end

    it "shows typing timeline events" do
      expect(page).to have_content("Typing Timeline")
      expect(page).to have_css(".rounded-full") # Timeline event indicators
    end

    it "displays verification details" do
      expect(page).to have_content("Verification Details")
      expect(page).to have_content(document.author.display_name)
      expect(page).to have_content(document.word_count.to_s)
      expect(page).to have_content("✓ Every keystroke captured in real-time")
      expect(page).to have_content("✓ No copy-paste operations detected")
    end

    it "shows pattern analysis" do
      expect(page).to have_content("Pattern Analysis")
      expect(page).to have_content("Typing Consistency")
      expect(page).to have_content("Pause Patterns")
      expect(page).to have_content("Correction Rate")
    end

    it "has proper navigation" do
      expect(page).to have_link("Back to Post")
      
      click_link "Back to Post"
      expect(current_path).to eq(public_post_path(document.public_slug))
    end
  end

  describe "keystroke replay functionality" do
    before do
      visit public_post_keystrokes_path(document.public_slug)
    end

    it "can start and pause replay", js: true do
      expect(page).to have_button("Play")
      
      click_button "Play"
      expect(page).to have_button("Pause")
      
      click_button "Pause"
      expect(page).to have_button("Play")
    end

    it "can reset replay", js: true do
      click_button "Play"
      sleep 0.5 # Let some replay happen
      click_button "Reset"
      
      expect(page).to have_button("Play")
      # Progress should be back to 0
      expect(page).to have_content("Progress: 0 /")
    end

    it "can change playback speed", js: true do
      click_button "2x"
      expect(page).to have_css(".bg-primary", text: "2x") # Selected speed button
      
      click_button "5x"
      expect(page).to have_css(".bg-primary", text: "5x")
    end

    it "shows progress during replay", js: true do
      expect(page).to have_content("Progress: 0 /")
      expect(page).to have_content("0.0%")
    end
  end

  describe "performance with large datasets" do
    let(:large_document) { create(:document, :published, user: user) }
    
    before do
      # Create a large number of keystrokes to test pagination
      create_list(:keystroke, 1500, document: large_document) do |keystroke, index|
        keystroke.sequence_number = index + 1
        keystroke.timestamp = Time.current - 1.hour + (index * 0.1).seconds
        keystroke.cursor_position = index
      end
    end

    it "handles large keystroke datasets with pagination" do
      visit public_post_keystrokes_path(large_document.public_slug)
      
      expect(page).to have_content("more keystrokes available")
      expect(page).to have_content("Keystroke Timeline")
      
      # Should still load and display properly
      expect(page).to have_button("Play")
      expect(page).to have_content("Total Time")
    end
  end

  describe "data download functionality" do
    before do
      visit public_post_keystrokes_path(document.public_slug)
    end

    it "provides download button for keystroke data", js: true do
      expect(page).to have_button("Download Data")
      
      # Note: Testing actual file download in system tests is complex
      # This test verifies the button exists and is clickable
    end
  end

  describe "error handling" do
    it "shows 404 for non-existent post slugs" do
      visit public_post_keystrokes_path("non-existent-slug")
      
      expect(page).to have_content("Page Not Found")
    end

    it "shows 404 for draft posts" do
      draft_document = create(:document, :draft, user: user)
      
      visit public_post_keystrokes_path(draft_document.public_slug)
      
      expect(page).to have_content("Page Not Found")
    end
  end

  describe "SEO and meta tags" do
    before do
      visit public_post_keystrokes_path(document.public_slug)
    end

    it "has proper page title" do
      expect(page).to have_title("#{document.title} - Keystroke Timeline - Signify")
    end

    it "includes verification-focused meta description" do
      expect(page).to have_css(
        'meta[name="description"][content*="keystroke-by-keystroke verification"]', 
        visible: false
      )
    end
  end

  describe "accessibility" do
    before do
      visit public_post_keystrokes_path(document.public_slug)
    end

    it "has proper ARIA labels and semantic markup" do
      expect(page).to have_css('main, article, section, header')
      expect(page).to have_css('[role]')
    end

    it "provides keyboard navigation for controls" do
      # Verify important interactive elements are focusable
      play_button = find_button("Play")
      expect(play_button[:tabindex]).not_to eq("-1")
    end
  end
end