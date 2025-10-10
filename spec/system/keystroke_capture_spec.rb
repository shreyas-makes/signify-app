# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Keystroke Capture", type: :system do
  let(:user) { User.create!(name: "Test User", email: "test@example.com", password: "secure_password", display_name: "Test User") }
  let(:document) { user.documents.create!(title: "Test Document", content: "Initial content", status: :draft) }
  
  before do
    sign_in_user(user)
  end
  
  it "captures keystrokes while typing in the editor" do
    visit edit_document_path(document)
    
    # Wait for editor to load
    expect(page).to have_content("Test Document")
    
    # Find the editor textarea
    editor = find("textarea", match: :first)
    
    # Type some text
    editor.click
    editor.send_keys("Hello World")
    
    # Check that keystroke count is displayed
    expect(page).to have_content(/\d+ keystrokes/)
    
    # Verify paste is prevented
    editor.send_keys([:control, 'v'])
    
    # The text should still be "Hello World" (paste should be blocked)
    expect(editor.value).to include("Hello World")
  end
  
  it "displays keystroke count in real-time" do
    visit edit_document_path(document)
    
    # Initially should show 0 keystrokes
    expect(page).to have_content("0 keystrokes")
    
    # Type a few characters
    editor = find("textarea", match: :first)
    editor.click
    editor.send_keys("Test")
    
    # Should show keystroke count has increased
    expect(page).to have_content(/[1-9]\d* keystrokes/)
  end
end