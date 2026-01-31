# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Public::Authors", type: :request do
  let(:author) { create(:user) }
  let!(:published_post) { create(:document, :published, user: author, title: "Published Post") }
  let!(:draft_post) { create(:document, user: author, title: "Draft Post") }

  describe "GET /authors/:id" do
    it "renders the author page with published posts" do
      get public_author_path(author.id)

      expect(response).to have_http_status(:ok)
      expect(response.body).to include("public/authors/show")
      expect(response.body).to include(author.display_name)
      expect(response.body).to include(published_post.title)
      expect(response.body).not_to include(draft_post.title)
    end

    it "returns 404 for missing authors" do
      get public_author_path("999999")

      expect(response).to have_http_status(:not_found)
      expect(response.body).to include("errors/not_found")
    end
  end
end
