# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Public::OgImages", type: :request do
  let(:user) { create(:user) }
  let!(:document) { create(:document, :published, user: user) }
  let(:storage_path) { Rails.root.join("tmp", "og-test.png") }

  describe "GET /posts/:public_slug/og-image" do
    after do
      File.delete(storage_path) if File.exist?(storage_path)
    end

    it "serves the generated OG image with cache headers" do
      File.binwrite(storage_path, "png")

      allow(OgImageService).to receive(:storage_path_for).with(document).and_return(storage_path.to_s)
      allow(OgImageService).to receive(:generate_for_post).with(document)

      get public_post_og_image_path(document.public_slug)

      expect(response).to have_http_status(:ok)
      expect(response.content_type).to include("image/png")
      expect(response.headers["Cache-Control"]).to include("max-age=86400")
    end

    it "returns 404 when the post is missing" do
      get public_post_og_image_path("missing-post")

      expect(response).to have_http_status(:not_found)
      expect(response.body).to include("Post not found")
    end

    it "returns 503 when the image cannot be generated" do
      allow(OgImageService).to receive(:storage_path_for).with(document).and_return(storage_path.to_s)
      allow(OgImageService).to receive(:generate_for_post).with(document)

      get public_post_og_image_path(document.public_slug)

      expect(response).to have_http_status(:service_unavailable)
      expect(response.body).to include("OG image unavailable")
    end
  end
end
