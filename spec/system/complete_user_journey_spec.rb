# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Complete User Journey", type: :system do
  before do
    driven_by(:selenium, using: :headless_chrome, screen_size: [1400, 1400])
  end

  it "completes the full signup → write → publish → share flow" do
    # Step 1: User Registration
    visit root_path
    click_link "Sign up"
    
    fill_in "Name", with: "Test Writer"
    fill_in "Display name", with: "TestWriter"
    fill_in "Email", with: "writer@example.com"
    fill_in "Password", with: "secure_password_123"
    
    click_button "Sign up"
    
    # Should be redirected to dashboard after signup
    expect(page).to have_content("Welcome to Signify")
    expect(page).to have_content("TestWriter")
    
    # Step 2: Create a new document
    click_button "New Document"
    
    # Should be redirected to edit page
    expect(page).to have_content("Document Editor")
    expect(page).to have_selector("input[placeholder*='Enter document title']")
    expect(page).to have_selector("textarea[placeholder*='Start writing']")
    
    # Step 3: Write content with keystroke capture
    title_input = find("input[placeholder*='Enter document title']")
    content_textarea = find("textarea[placeholder*='Start writing']")
    
    # Clear default title and add our own
    title_input.click
    title_input.send_keys([:control, 'a'], :delete)
    title_input.type("My First Verified Post")
    
    # Add content
    content_textarea.click
    content_textarea.type("This is my first post written with keystroke verification.")
    content_textarea.type(" Every keystroke is being captured to prove this was written by a human.")
    content_textarea.type(" This is revolutionary technology for content authenticity.")
    
    # Wait for auto-save to trigger
    sleep 3
    
    # Should see save status indicator
    expect(page).to have_content("Saved") || have_content("Saving")
    
    # Step 4: Verify word count and keystroke capture
    expect(page).to have_content(/\d+ words/)
    expect(page).to have_content(/\d+ characters/)
    
    # Step 5: Publish the document
    click_button "Publish"
    
    # Should see success message
    expect(page).to have_content("Document published successfully")
    expect(page).to have_content("Your keystroke-verified post is now live")
    
    # Step 6: Verify document is published
    expect(page).to have_content("Published")
    expect(page).to have_button("Published", disabled: true)
    
    # Should have a public URL
    expect(page).to have_link("View Public Post")
    
    # Step 7: Visit the public post
    click_link "View Public Post"
    
    # Should be on public post page
    expect(page).to have_content("My First Verified Post")
    expect(page).to have_content("This is my first post written with keystroke verification")
    expect(page).to have_content("by TestWriter")
    expect(page).to have_content("Keystroke Verified")
    
    # Should have verification info
    expect(page).to have_content(/\d+ words/)
    expect(page).to have_content(/\d+ keystrokes/)
    expect(page).to have_content("Human Written")
    
    # Step 8: Test keystroke visualization
    click_button "View Keystroke Data"
    
    # Should see keystroke visualization
    expect(page).to have_content("Keystroke Verification")
    expect(page).to have_content("Typing Timeline")
    
    # Should have export options
    expect(page).to have_link("Export JSON")
    expect(page).to have_link("Export CSV")
    
    # Step 9: Test data export
    click_link "Export JSON"
    
    # Should trigger download (we can't test actual download in headless mode,
    # but we can verify the request doesn't error)
    sleep 1
    
    # Step 10: Return to dashboard and verify document appears
    visit dashboard_path
    
    expect(page).to have_content("My First Verified Post")
    expect(page).to have_content("Published")
    expect(page).to have_content(/\d+ words/)
    
    # Step 11: Test document list functionality
    expect(page).to have_content("1 document")
    expect(page).to have_content("1 published")
    
    # Verify statistics
    expect(page).to have_content(/Total Words: \d+/)
    expect(page).to have_content(/Total Keystrokes: \d+/)
  end

  it "enforces publishing requirements" do
    user = FactoryBot.create(:user, display_name: "TestUser")
    sign_in_as(user)
    
    visit new_document_path
    
    # Try to publish empty document
    expect(page).not_to have_button("Publish")
    
    # Add title but no content
    title_input = find("input[placeholder*='Enter document title']")
    title_input.click
    title_input.send_keys([:control, 'a'], :delete)
    title_input.type("Empty Post")
    
    sleep 1
    
    # Still shouldn't be able to publish
    expect(page).not_to have_button("Publish")
    
    # Add some content
    content_textarea = find("textarea[placeholder*='Start writing']")
    content_textarea.click
    content_textarea.type("Now this has content and keystrokes.")
    
    sleep 2
    
    # Now should be able to publish
    expect(page).to have_button("Publish")
  end

  it "prevents paste operations" do
    user = FactoryBot.create(:user)
    sign_in_as(user)
    
    visit new_document_path
    
    content_textarea = find("textarea[placeholder*='Start writing']")
    content_textarea.click
    
    # Try to paste (should be prevented)
    content_textarea.send_keys([:control, 'v'])
    
    # Should see paste prevention message
    expect(page).to have_content("Paste operations are not allowed")
  end

  it "maintains data integrity across sessions" do
    user = FactoryBot.create(:user)
    document = FactoryBot.create(:document, user: user, title: "Session Test", content: "Original content")
    
    sign_in_as(user)
    visit edit_document_path(document)
    
    # Verify content is loaded
    expect(page).to have_field("title", with: "Session Test")
    expect(page.find("textarea")).value.to include("Original content")
    
    # Make changes
    content_textarea = find("textarea")
    content_textarea.click
    content_textarea.send_keys(" Additional content added.")
    
    sleep 2
    
    # Reload page
    visit edit_document_path(document)
    
    # Changes should be preserved
    expect(page.find("textarea")).value.to include("Additional content added")
  end

  private

  def sign_in_as(user)
    visit sign_in_path
    fill_in "Email", with: user.email
    fill_in "Password", with: "password123"
    click_button "Sign in"
  end
end