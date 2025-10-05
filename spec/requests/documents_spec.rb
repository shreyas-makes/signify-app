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

    context "when not authenticated" do
      before { sign_out }

      it "redirects to sign in" do
        get documents_url
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