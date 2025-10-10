# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Document Dashboard", type: :system, js: true do
  include AuthenticationHelpers

  let(:user) { create(:user) }
  let!(:draft_documents) { create_list(:document, 5, user: user, status: :draft, title: "Draft Document") }
  let!(:ready_documents) { create_list(:document, 3, user: user, status: :ready_to_publish, title: "Ready Document") }
  let!(:published_documents) { create_list(:document, 2, user: user, status: :published, title: "Published Document") }

  before do
    sign_in_as(user)
    visit documents_path
  end

  describe "dashboard layout" do
    it "displays the document dashboard with statistics" do
      expect(page).to have_content("Your Documents")
      expect(page).to have_content("Create and manage your verified writings")
      
      # Statistics cards
      expect(page).to have_content("Total Documents")
      expect(page).to have_content("10") # 5 + 3 + 2 documents
      expect(page).to have_content("Total Words")
      expect(page).to have_content("Keystrokes")
      expect(page).to have_content("Ready to Publish")
      expect(page).to have_content("3") # ready_to_publish count
    end

    it "displays new document button" do
      expect(page).to have_link("New Document")
    end
  end

  describe "document display modes" do
    it "defaults to grid view" do
      # Grid view should be active by default
      expect(page).to have_selector('[data-testid="grid-view"]', class: /bg-/)
    end

    it "can switch to table view" do
      click_button "List"
      
      # Should show table headers
      expect(page).to have_content("Title")
      expect(page).to have_content("Status")
      expect(page).to have_content("Words")
      expect(page).to have_content("Keystrokes")
      expect(page).to have_content("Updated")
    end

    it "can switch back to grid view" do
      click_button "List"
      click_button "Grid"
      
      # Should show card layout
      expect(page).to have_selector(".grid")
    end
  end

  describe "search functionality" do
    it "can search documents by title" do
      fill_in "Search documents...", with: "Draft"
      
      # Should show only draft documents
      expect(page).to have_content("Draft Document", count: 5)
      expect(page).not_to have_content("Published Document")
    end

    it "can search documents by content" do
      create(:document, user: user, title: "Special Doc", content: "Ruby programming tutorial")
      visit documents_path
      
      fill_in "Search documents...", with: "Ruby"
      
      expect(page).to have_content("Special Doc")
    end

    it "shows no results message for empty search" do
      fill_in "Search documents...", with: "NonexistentSearchTerm"
      
      expect(page).to have_content("No documents found")
      expect(page).to have_content("Try adjusting your search criteria")
    end
  end

  describe "filtering functionality" do
    it "can filter by status" do
      select "Draft", from: "Filter by status"
      
      expect(page).to have_content("Draft Document", count: 5)
      expect(page).not_to have_content("Published Document")
    end

    it "can filter by ready to publish" do
      select "Ready to Publish", from: "Filter by status"
      
      expect(page).to have_content("Ready Document", count: 3)
      expect(page).not_to have_content("Draft Document")
    end

    it "can filter by published" do
      select "Published", from: "Filter by status"
      
      expect(page).to have_content("Published Document", count: 2)
      expect(page).not_to have_content("Draft Document")
    end

    it "can show all documents" do
      select "All Status", from: "Filter by status"
      
      expect(page).to have_content("Draft Document")
      expect(page).to have_content("Ready Document")
      expect(page).to have_content("Published Document")
    end
  end

  describe "sorting functionality" do
    before do
      click_button "List" # Switch to table view for easier sorting testing
    end

    it "can sort by title" do
      click_button "Title"
      
      # Should sort alphabetically
      documents = page.all("tbody tr td:first-child").map(&:text)
      expect(documents).to eq(documents.sort)
    end

    it "can reverse sort direction" do
      click_button "Title" # First click for ascending
      click_button "Title" # Second click for descending
      
      documents = page.all("tbody tr td:first-child").map(&:text)
      expect(documents).to eq(documents.sort.reverse)
    end
  end

  describe "bulk operations" do
    before do
      # Select some documents
      first(:checkbox).check
      page.all(:checkbox)[1].check
    end

    it "shows bulk actions when documents are selected" do
      expect(page).to have_content("Bulk Actions (2)")
    end

    it "can perform bulk delete on draft documents", skip: "Requires more complex JS interaction" do
      click_button "Bulk Actions (2)"
      click_link "Delete Selected"
      
      expect {
        accept_confirm
        sleep 1 # Wait for AJAX request
      }.to change(Document, :count)
    end

    it "can mark documents as ready to publish", skip: "Requires more complex JS interaction" do
      click_button "Bulk Actions (2)"
      click_link "Mark as Ready to Publish"
      
      sleep 1 # Wait for AJAX request
      expect(page).to have_content("marked as ready to publish")
    end
  end

  describe "pagination" do
    before do
      # Create enough documents to trigger pagination
      create_list(:document, 15, user: user, title: "Extra Document")
      visit documents_path
    end

    it "shows pagination when there are many documents" do
      expect(page).to have_content("Previous")
      expect(page).to have_content("Next")
      expect(page).to have_content("Showing")
    end

    it "can navigate to next page" do
      click_button "Next"
      
      expect(page).to have_current_path(documents_path(page: 2))
    end
  end

  describe "document actions" do
    it "can edit a document" do
      within first(".card") do
        click_link "Edit"
      end
      
      expect(page).to have_current_path(/\/documents\/\d+\/edit/)
    end

    it "can delete a draft document" do
      draft_doc = draft_documents.first
      
      within first(".card") do
        accept_confirm do
          click_button "Delete"
        end
      end
      
      expect(page).not_to have_content(draft_doc.title)
    end

    it "does not show delete button for published documents" do
      visit documents_path(status: "published")
      
      expect(page).not_to have_button("Delete")
    end
  end

  describe "responsive design" do
    it "works on mobile viewport", skip: "Requires viewport testing setup" do
      page.driver.browser.manage.window.resize_to(375, 667)
      visit documents_path
      
      expect(page).to have_content("Your Documents")
    end
  end

  describe "empty state" do
    let(:new_user) { create(:user) }
    
    before do
      sign_in_as(new_user)
      visit documents_path
    end

    it "shows empty state for new users" do
      expect(page).to have_content("No documents yet")
      expect(page).to have_content("Start writing your first verified document")
      expect(page).to have_link("Create your first document")
    end
  end

  describe "performance with many documents", skip: "Performance test" do
    before do
      create_list(:document, 100, user: user)
      visit documents_path
    end

    it "loads dashboard quickly with many documents" do
      start_time = Time.current
      expect(page).to have_content("Your Documents")
      load_time = Time.current - start_time
      
      expect(load_time).to be < 2.seconds
    end
  end
end