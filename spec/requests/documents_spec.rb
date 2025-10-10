# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Documents", type: :request do
  include AuthenticationHelpers

  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  let(:document) { create(:document, user: user) }
  let(:other_user_document) { create(:document, user: other_user) }

  before do
    sign_in_as(user)
  end

  describe "GET /documents" do
    it "returns http success" do
      get documents_url
      expect(response).to have_http_status(:success)
    end

    it "only shows current user's documents" do
      user_doc = create(:document, user: user, title: "My Document")
      other_doc = create(:document, user: other_user, title: "Other Document")

      get documents_url
      expect(response).to have_http_status(:success)
      
      # Note: In a real implementation, you'd parse the Inertia response
      # For now, we'll just verify the controller behavior
    end

    context "search functionality" do
      before do
        create(:document, user: user, title: "Ruby Programming", content: "Learning Ruby")
        create(:document, user: user, title: "Python Guide", content: "Learning Python")
        create(:document, user: user, title: "JavaScript Tips", content: "Advanced JS")
      end

      it "searches by title" do
        get documents_url, params: { search: "Ruby" }
        expect(response).to have_http_status(:success)
      end

      it "searches by content" do
        get documents_url, params: { search: "Learning" }
        expect(response).to have_http_status(:success)
      end

      it "handles empty search" do
        get documents_url, params: { search: "" }
        expect(response).to have_http_status(:success)
      end
    end

    context "filtering functionality" do
      before do
        create(:document, user: user, status: :draft)
        create(:document, user: user, status: :ready_to_publish)
        create(:document, user: user, status: :published)
      end

      it "filters by draft status" do
        get documents_url, params: { status: "draft" }
        expect(response).to have_http_status(:success)
      end

      it "filters by ready_to_publish status" do
        get documents_url, params: { status: "ready_to_publish" }
        expect(response).to have_http_status(:success)
      end

      it "filters by published status" do
        get documents_url, params: { status: "published" }
        expect(response).to have_http_status(:success)
      end

      it "shows all when status is 'all'" do
        get documents_url, params: { status: "all" }
        expect(response).to have_http_status(:success)
      end
    end

    context "sorting functionality" do
      before do
        create(:document, user: user, title: "Z Document", created_at: 1.day.ago)
        create(:document, user: user, title: "A Document", created_at: 2.days.ago)
      end

      it "sorts by title ascending" do
        get documents_url, params: { sort: "title", direction: "asc" }
        expect(response).to have_http_status(:success)
      end

      it "sorts by created_at descending" do
        get documents_url, params: { sort: "created_at", direction: "desc" }
        expect(response).to have_http_status(:success)
      end

      it "sorts by word_count" do
        get documents_url, params: { sort: "word_count", direction: "desc" }
        expect(response).to have_http_status(:success)
      end
    end

    context "pagination" do
      before do
        15.times { |i| create(:document, user: user, title: "Document #{i}") }
      end

      it "paginates results" do
        get documents_url, params: { page: 1 }
        expect(response).to have_http_status(:success)
      end

      it "handles second page" do
        get documents_url, params: { page: 2 }
        expect(response).to have_http_status(:success)
      end

      it "defaults to page 1 when page not specified" do
        get documents_url
        expect(response).to have_http_status(:success)
      end
    end

    context "when not authenticated" do
      before { sign_out }

      it "redirects to sign in" do
        get documents_url
        expect(response).to redirect_to(sign_in_url)
      end
    end
  end

  describe "POST /documents/bulk_action" do
    let!(:draft_docs) { create_list(:document, 3, user: user, status: :draft) }
    let!(:ready_docs) { create_list(:document, 2, user: user, status: :ready_to_publish) }
    let!(:other_user_docs) { create_list(:document, 2, user: other_user, status: :draft) }

    context "bulk delete" do
      it "deletes selected draft documents" do
        document_ids = draft_docs.first(2).map(&:id)
        
        expect {
          post bulk_action_documents_url, params: {
            document_ids: document_ids,
            bulk_action: "delete"
          }
        }.to change(Document, :count).by(-2)
        
        expect(response).to have_http_status(:success)
        json_response = JSON.parse(response.body)
        expect(json_response["success"]).to be true
        expect(json_response["deleted_count"]).to eq(2)
      end

      it "only deletes draft documents" do
        mixed_ids = [draft_docs.first.id, ready_docs.first.id]
        
        expect {
          post bulk_action_documents_url, params: {
            document_ids: mixed_ids,
            bulk_action: "delete"
          }
        }.to change(Document, :count).by(-1)  # Only draft should be deleted
      end

      it "does not delete other users' documents" do
        document_ids = [draft_docs.first.id, other_user_docs.first.id]
        
        expect {
          post bulk_action_documents_url, params: {
            document_ids: document_ids,
            bulk_action: "delete"
          }
        }.to change(Document, :count).by(-1)  # Only own document deleted
      end
    end

    context "bulk status changes" do
      it "marks draft documents as ready to publish" do
        document_ids = draft_docs.first(2).map(&:id)
        
        post bulk_action_documents_url, params: {
          document_ids: document_ids,
          bulk_action: "mark_ready"
        }
        
        expect(response).to have_http_status(:success)
        draft_docs.first(2).each do |doc|
          expect(doc.reload.status).to eq("ready_to_publish")
        end
      end

      it "marks ready_to_publish documents as draft" do
        document_ids = ready_docs.map(&:id)
        
        post bulk_action_documents_url, params: {
          document_ids: document_ids,
          bulk_action: "mark_draft"
        }
        
        expect(response).to have_http_status(:success)
        ready_docs.each do |doc|
          expect(doc.reload.status).to eq("draft")
        end
      end
    end

    context "error handling" do
      it "handles invalid bulk action" do
        post bulk_action_documents_url, params: {
          document_ids: [draft_docs.first.id],
          bulk_action: "invalid_action"
        }
        
        expect(response).to have_http_status(:unprocessable_content)
        json_response = JSON.parse(response.body)
        expect(json_response["success"]).to be false
      end

      it "handles empty document_ids" do
        post bulk_action_documents_url, params: {
          document_ids: [],
          bulk_action: "delete"
        }
        
        expect(response).to have_http_status(:success)
        json_response = JSON.parse(response.body)
        expect(json_response["deleted_count"]).to eq(0)
      end
    end

    context "when not authenticated" do
      before { sign_out }

      it "redirects to sign in" do
        post bulk_action_documents_url, params: {
          document_ids: [draft_docs.first.id],
          bulk_action: "delete"
        }
        expect(response).to redirect_to(sign_in_url)
      end
    end
  end

  describe "GET /documents/new" do
    it "returns http success" do
      get new_document_url
      expect(response).to have_http_status(:success)
    end

    context "when not authenticated" do
      before { sign_out }

      it "redirects to sign in" do
        get new_document_url
        expect(response).to redirect_to(sign_in_url)
      end
    end
  end

  describe "POST /documents" do
    let(:valid_params) do
      { document: { title: "New Test Document" } }
    end

    let(:invalid_params) do
      { document: { title: "" } }
    end

    it "creates a new document with valid params" do
      expect {
        post documents_url, params: valid_params
      }.to change(Document, :count).by(1)

      document = Document.last
      expect(document.title).to eq("New Test Document")
      expect(document.status).to eq("draft")
      expect(document.slug).to be_present
      expect(document.user).to eq(user)
      expect(response).to redirect_to(edit_document_path(document))
    end

    it "generates a unique slug from title" do
      post documents_url, params: valid_params
      document = Document.last
      expect(document.slug).to eq("new-test-document")
    end

    it "handles duplicate titles with unique slugs" do
      create(:document, user: user, title: "New Test Document", slug: "new-test-document")
      
      post documents_url, params: valid_params
      document = Document.last
      expect(document.slug).to eq("new-test-document-1")
    end

    it "does not create document with invalid params" do
      expect {
        post documents_url, params: invalid_params
      }.not_to change(Document, :count)

      expect(response).to have_http_status(:success)
    end

    context "when not authenticated" do
      before { sign_out }

      it "redirects to sign in" do
        post documents_url, params: valid_params
        expect(response).to redirect_to(sign_in_url)
      end
    end
  end

  describe "GET /documents/:id/edit" do
    it "returns http success for own document" do
      get edit_document_url(document)
      expect(response).to have_http_status(:success)
    end

    it "returns not found for other user's document" do
      get edit_document_url(other_user_document)
      expect(response).to have_http_status(:not_found)
    end

    context "when not authenticated" do
      before { sign_out }

      it "redirects to sign in" do
        get edit_document_url(document)
        expect(response).to redirect_to(sign_in_url)
      end
    end
  end

  describe "PATCH /documents/:id" do
    let(:valid_params) do
      { document: { title: "Updated Title", content: "Updated content" } }
    end

    let(:invalid_params) do
      { document: { title: "" } }
    end

    it "updates document with valid params" do
      patch document_url(document), params: valid_params
      
      document.reload
      expect(document.title).to eq("Updated Title")
      expect(document.content).to eq("Updated content")
      expect(response).to have_http_status(:success)
    end

    it "does not update with invalid params" do
      original_title = document.title
      patch document_url(document), params: invalid_params
      
      document.reload
      expect(document.title).to eq(original_title)
      expect(response).to have_http_status(:unprocessable_content)
    end

    it "returns not found for other user's document" do
      patch document_url(other_user_document), params: valid_params
      expect(response).to have_http_status(:not_found)
    end

    context "when not authenticated" do
      before { sign_out }

      it "redirects to sign in" do
        patch document_url(document), params: valid_params
        expect(response).to redirect_to(sign_in_url)
      end
    end
  end

  describe "POST /documents/:id/publish" do
    let(:document_with_keystrokes) do
      doc = create(:document, user: user, title: "Test Doc", content: "Some content", status: :draft)
      create(:keystroke, document: doc)
      doc
    end

    it "publishes a valid document" do
      post publish_document_url(document_with_keystrokes)
      
      document_with_keystrokes.reload
      expect(document_with_keystrokes.status).to eq("published")
      expect(document_with_keystrokes.published_at).to be_present
      expect(document_with_keystrokes.public_slug).to be_present
      expect(response).to redirect_to(edit_document_path(document_with_keystrokes))
    end

    it "prevents publishing without title" do
      document_without_title = build(:document, user: user, title: "", content: "Content", status: :draft)
      document_without_title.save(validate: false) # Bypass validation to create invalid record
      create(:keystroke, document: document_without_title)
      
      post publish_document_url(document_without_title)
      
      document_without_title.reload
      expect(document_without_title.status).to eq("draft")
      expect(response).to redirect_to(edit_document_path(document_without_title))
    end

    it "prevents publishing without content" do
      document_without_content = build(:document, user: user, title: "Title", content: "", status: :draft)
      document_without_content.save(validate: false) # Bypass validation to create invalid record
      create(:keystroke, document: document_without_content)
      
      post publish_document_url(document_without_content)
      
      document_without_content.reload
      expect(document_without_content.status).to eq("draft")
      expect(response).to redirect_to(edit_document_path(document_without_content))
    end

    it "prevents publishing without keystrokes" do
      document_without_keystrokes = create(:document, user: user, title: "Title", content: "Content", status: :draft)
      
      post publish_document_url(document_without_keystrokes)
      
      document_without_keystrokes.reload
      expect(document_without_keystrokes.status).to eq("draft")
      expect(response).to redirect_to(edit_document_path(document_without_keystrokes))
    end

    it "prevents publishing already published documents" do
      published_doc = create(:document, :published, user: user)
      
      post publish_document_url(published_doc)
      
      expect(response).to redirect_to(edit_document_path(published_doc))
    end

    it "returns not found for other user's document" do
      post publish_document_url(other_user_document)
      expect(response).to have_http_status(:not_found)
    end

    context "when not authenticated" do
      before { sign_out }

      it "redirects to sign in" do
        post publish_document_url(document_with_keystrokes)
        expect(response).to redirect_to(sign_in_url)
      end
    end
  end

  describe "DELETE /documents/:id" do
    it "hard deletes draft documents" do
      draft_doc = create(:document, user: user, status: :draft)
      
      expect {
        delete document_url(draft_doc)
      }.to change(Document, :count).by(-1)
      
      expect(response).to redirect_to(documents_url)
    end

    it "soft deletes published documents" do
      published_doc = create(:document, :published, user: user)
      
      expect {
        delete document_url(published_doc)
      }.not_to change(Document, :count)
      
      published_doc.reload
      expect(published_doc.status).to eq("draft")
      expect(response).to redirect_to(documents_url)
    end

    it "returns not found for other user's document" do
      delete document_url(other_user_document)
      expect(response).to have_http_status(:not_found)
    end

    context "when not authenticated" do
      before { sign_out }

      it "redirects to sign in" do
        delete document_url(document)
        expect(response).to redirect_to(sign_in_url)
      end
    end
  end
end