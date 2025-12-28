# frozen_string_literal: true

class Public::OgImagesController < ApplicationController
  skip_before_action :authenticate
  before_action :set_post
  before_action :skip_session

  def show
    unless @post
      render plain: "Post not found", status: :not_found
      return
    end

    storage_path = OgImageService.storage_path_for(@post)
    OgImageService.generate_for_post(@post) unless File.exist?(storage_path)

    if File.exist?(storage_path)
      expires_in 1.day, public: true
      response.headers["Cache-Control"] = "public, max-age=86400"
      send_file storage_path, type: "image/png", disposition: "inline"
    else
      render plain: "OG image unavailable", status: :service_unavailable
    end
  end

  private

  def set_post
    @post = Document.public_visible.find_by(public_slug: params[:public_slug])
  end

  def skip_session
    request.session_options[:skip] = true
  end
end
