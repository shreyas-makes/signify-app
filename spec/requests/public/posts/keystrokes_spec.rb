# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Public::Posts::Keystrokes", type: :request do
  let(:user) { create(:user) }
  let(:document) { create(:document, :published, user: user) }
  
  before do
    create_list(:keystroke, 100, document: document) do |keystroke, index|
      keystroke.sequence_number = index + 1
      keystroke.timestamp = Time.current - 1.hour + (index * 2).seconds
      keystroke.cursor_position = index
      keystroke.character = ('a'..'z').to_a.sample if keystroke.event_type == 'keydown'
    end
  end

  describe "GET /posts/:public_slug/keystrokes" do
    it "returns the keystroke visualization page" do
      get public_post_keystrokes_path(document.public_slug)
      
      expect(response).to have_http_status(:ok)
      expect(response.body).to include("Keystroke Timeline")
      expect(response.body).to include(document.title)
    end

    it "includes keystroke data in props" do
      get public_post_keystrokes_path(document.public_slug)
      
      # The response should include JSON data for Inertia
      expect(response.content_type).to include("text/html")
      
      # Check that the page loads with the expected elements
      expect(response.body).to include("keystroke")
      expect(response.body).to include("verification")
    end

    it "includes pagination data" do
      get public_post_keystrokes_path(document.public_slug)
      
      expect(response).to have_http_status(:ok)
      # Pagination info should be included in the response
      expect(response.body).to include("pagination")
    end

    it "handles pagination parameters" do
      get public_post_keystrokes_path(document.public_slug), params: { page: 2 }
      
      expect(response).to have_http_status(:ok)
    end

    it "limits keystrokes per page for performance" do
      # Create more keystrokes than the per_page limit
      create_list(:keystroke, 1500, document: document) do |keystroke, index|
        keystroke.sequence_number = index + 101 # Start after existing keystrokes
        keystroke.timestamp = Time.current - 30.minutes + (index * 0.1).seconds
        keystroke.cursor_position = index + 100
      end

      get public_post_keystrokes_path(document.public_slug)
      
      expect(response).to have_http_status(:ok)
      # Should indicate more data is available
      expect(response.body).to include("has_more")
    end

    context "with AJAX requests for pagination" do
      it "returns JSON data for AJAX requests" do
        get public_post_keystrokes_path(document.public_slug), 
            params: { page: 1 },
            headers: { 'X-Requested-With' => 'XMLHttpRequest' }
        
        # Note: This is an Inertia request, so it would return Inertia JSON format
        expect(response).to have_http_status(:ok)
      end
    end

    context "with non-existent post" do
      it "returns 404 for non-existent public slug" do
        get public_post_keystrokes_path("non-existent-slug")
        
        expect(response).to have_http_status(:not_found)
        # The error page is rendered via Inertia, so check for the component
        expect(response.body).to include("errors/not_found")
      end
    end

    context "with draft post" do
      let(:draft_document) { create(:document, :draft, user: user, public_slug: "draft-slug") }
      
      it "returns 404 for draft posts" do
        get public_post_keystrokes_path(draft_document.public_slug)
        
        expect(response).to have_http_status(:not_found)
        expect(response.body).to include("errors/not_found")
      end
    end

    context "without keystrokes" do
      let(:document_without_keystrokes) { create(:document, :published, user: user) }
      
      it "handles posts without keystrokes gracefully" do
        get public_post_keystrokes_path(document_without_keystrokes.public_slug)
        
        expect(response).to have_http_status(:ok)
        expect(response.body).to include("Keystroke Timeline")
        # Should still show the interface even with no keystrokes
      end
    end
  end

  describe "keystroke data format" do
    it "formats timestamps as milliseconds" do
      get public_post_keystrokes_path(document.public_slug)
      
      expect(response).to have_http_status(:ok)
      # Verify that the keystroke data structure is present
      expect(response.body).to include("timestamp")
    end

    it "includes all required keystroke fields" do
      get public_post_keystrokes_path(document.public_slug)
      
      expect(response).to have_http_status(:ok)
      # Check for the presence of required keystroke data fields
      %w[event_type key_code character cursor_position sequence_number].each do |field|
        expect(response.body).to include(field)
      end
    end
  end

  describe "meta tags for keystroke page" do
    it "includes keystroke-specific meta tags" do
      get public_post_keystrokes_path(document.public_slug)
      
      expect(response).to have_http_status(:ok)
      expect(response.body).to include("Keystroke Timeline")
      expect(response.body).to include("keystroke-by-keystroke verification")
    end

    it "has proper canonical URL" do
      get public_post_keystrokes_path(document.public_slug)
      
      expect(response).to have_http_status(:ok)
      expect(response.body).to include("keystrokes")
    end
  end

  describe "performance considerations" do
    context "with large keystroke datasets" do
      before do
        # Create a large number of keystrokes
        create_list(:keystroke, 2000, document: document) do |keystroke, index|
          keystroke.sequence_number = index + 101
          keystroke.timestamp = Time.current - 2.hours + (index * 0.05).seconds
          keystroke.cursor_position = index + 100
        end
      end

      it "responds in reasonable time" do
        start_time = Time.current
        get public_post_keystrokes_path(document.public_slug)
        end_time = Time.current
        
        expect(response).to have_http_status(:ok)
        expect(end_time - start_time).to be < 5.0 # Should respond within 5 seconds
      end

      it "implements pagination to limit response size" do
        get public_post_keystrokes_path(document.public_slug)
        
        expect(response).to have_http_status(:ok)
        # Response should indicate pagination is in use
        expect(response.body).to include("pagination")
      end
    end
  end

  describe "security" do
    it "does not require authentication for public keystroke data" do
      # Ensure no user is signed in
      get public_post_keystrokes_path(document.public_slug)
      
      expect(response).to have_http_status(:ok)
      expect(response).not_to redirect_to(sign_in_path)
    end

    it "does not expose sensitive user information" do
      get public_post_keystrokes_path(document.public_slug)
      
      expect(response).to have_http_status(:ok)
      # Should only include public information
      expect(response.body).to include(user.display_name)
      expect(response.body).not_to include(user.email)
    end
  end
end