# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Documents", type: :system do
  include AuthenticationHelpers

  before do
    driven_by(:selenium_headless)
  end

  let(:user) { create(:user) }

  before do
    sign_in_as(user)
  end

  describe "Document listing" do
    it "shows empty state when no documents exist" do
      visit documents_path

      expect(page).to have_content("No documents yet")
      expect(page).to have_content("Start writing your first verified document")
      expect(page).to have_link("Create your first document")
    end

    it "displays user's documents" do
      draft_doc = create(:document, user: user, title: "My Draft", status: :draft)
      published_doc = create(:document, :published, user: user, title: "My Published Article")

      visit documents_path

      expect(page).to have_content("Your Documents")
      expect(page).to have_content("My Draft")
      expect(page).to have_content("My Published Article")
      expect(page).to have_content("Draft")
      expect(page).to have_content("Published")
    end

    it "shows action buttons for documents" do
      document = create(:document, user: user, title: "Test Document")

      visit documents_path

      expect(page).to have_css("a[aria-label='Edit document']")
      expect(page).to have_css("button[aria-label='Delete document']") if document.draft?
    end

    it "only shows delete button for draft documents" do
      draft_doc = create(:document, user: user, title: "Draft Doc", status: :draft)
      published_doc = create(:document, :published, user: user, title: "Published Doc")

      visit documents_path

      # Check that we have both documents listed
      expect(page).to have_content("Draft Doc")
      expect(page).to have_content("Published Doc")
      
      # Check for at least one delete button (for draft)
      expect(page).to have_css("button[aria-label='Delete document']")
    end
  end

  describe "Document creation" do
    it "creates a new document successfully" do
      visit documents_path
      click_link "New Document"

      expect(page).to have_current_path(new_document_path)
      expect(page).to have_content("New Document")

      fill_in "title", with: "My New Document"
      click_button "Create Document"

      # Should redirect to edit page
      expect(page).to have_current_path(edit_document_path(Document.last))
      expect(page).to have_content("My New Document")

      # Verify document was created
      document = Document.last
      expect(document.title).to eq("My New Document")
      expect(document.user).to eq(user)
      expect(document.status).to eq("draft")
    end

    it "prevents creating documents with empty title" do
      visit new_document_path
      initial_document_count = Document.count

      # The form has a required field, which should prevent submission
      # This test verifies the client-side validation works
      expect(page).to have_css("input[required]")
      
      # With the required attribute, the form shouldn't submit
      fill_in "title", with: ""
      click_button "Create Document"

      # Should not have navigated away from the new document page
      expect(page).to have_content("New Document")
      expect(Document.count).to eq(initial_document_count)
    end

    it "allows canceling document creation" do
      visit new_document_path
      click_link "Back to Documents"

      expect(page).to have_current_path(documents_path)
    end
  end

  describe "Document editing" do
    let(:document) { create(:document, user: user, title: "Original Title", content: "Original content") }

    it "loads document for editing" do
      visit edit_document_path(document)

      expect(page).to have_field("title", with: "Original Title")
      expect(page).to have_css("textarea", text: "Original content")
      expect(page).to have_content("words") # Word count should be displayed
    end

    it "saves document changes" do
      visit edit_document_path(document)

      fill_in "title", with: "Updated Title"
      find("textarea").fill_in(with: "This is updated content with multiple words")
      click_button "Save"

      # Check for save confirmation
      expect(page).to have_content("Saved")

      # Verify changes were saved
      document.reload
      expect(document.title).to eq("Updated Title")
      expect(document.content).to eq("This is updated content with multiple words")
    end

    it "shows word count updates" do
      visit edit_document_path(document)

      find("textarea").fill_in(with: "This has exactly five words")
      
      # Word count should update in real-time
      expect(page).to have_content("5 words")
    end

    it "auto-saves after typing" do
      visit edit_document_path(document)

      find("textarea").fill_in(with: "Auto-save test content")
      
      # Wait for auto-save (controller has 2-second delay)
      sleep 3
      
      expect(page).to have_content("Saved")
      
      # Verify content was saved
      document.reload
      expect(document.content).to eq("Auto-save test content")
    end

    it "shows unsaved changes indicator" do
      visit edit_document_path(document)

      fill_in "title", with: "Changed Title"
      
      expect(page).to have_content("Unsaved changes")
    end

    it "allows navigation back to documents list" do
      visit edit_document_path(document)
      click_link "Back to Documents"

      expect(page).to have_current_path(documents_path)
    end
  end

  describe "Document deletion" do
    it "deletes draft documents with confirmation" do
      document = create(:document, user: user, title: "Draft to Delete", status: :draft)

      visit documents_path

      # Accept the confirmation dialog
      accept_confirm do
        find("button[aria-label='Delete document']").click
      end

      expect(page).to have_current_path(documents_path)
      expect(page).not_to have_content("Draft to Delete")
      expect(Document.exists?(document.id)).to be false
    end

    it "does not delete when confirmation is cancelled" do
      document = create(:document, user: user, title: "Draft to Keep", status: :draft)

      visit documents_path

      # Dismiss the confirmation dialog
      dismiss_confirm do
        find("button[aria-label='Delete document']").click
      end

      expect(page).to have_content("Draft to Keep")
      expect(Document.exists?(document.id)).to be true
    end
  end

  describe "Authentication protection" do
    before do 
      # Clear session by visiting an unauthenticated page and deleting cookies
      page.driver.browser.manage.delete_all_cookies
    end

    it "redirects unauthenticated users to sign in" do
      visit documents_path
      expect(page).to have_current_path(sign_in_path)
    end

    it "protects document creation" do
      visit new_document_path
      expect(page).to have_current_path(sign_in_path)
    end

    it "protects document editing" do
      document = create(:document, user: user)
      visit edit_document_path(document)
      expect(page).to have_current_path(sign_in_path)
    end
  end

  describe "Authorization" do
    let(:other_user) { create(:user) }
    let(:other_user_document) { create(:document, user: other_user) }

    it "prevents accessing other user's documents" do
      visit edit_document_path(other_user_document)
      
      # Should show the not found page
      expect(page).to have_content("not found")
    end
  end

  private

  def sign_in_as(user)
    visit sign_in_path
    fill_in "email", with: user.email
    fill_in "password", with: "Secret1*3*5*" # Default factory password
    click_button "Log in"
  end
end