# frozen_string_literal: true

require "fileutils"
require "net/http"

class OgImageService
  IMAGE_FORMAT = "png"
  IMAGE_WIDTH = 1200
  IMAGE_HEIGHT = 630

  def self.generate_for_post(post)
    return false if post.public_slug.blank?

    storage_path = storage_path_for(post)
    FileUtils.mkdir_p(storage_path.dirname)
    return true if File.exist?(storage_path)

    html = render_html(post)
    image_url = html2png_url(html)
    return false if image_url.blank?

    image_body = download_image(image_url)
    return false if image_body.blank?

    File.binwrite(storage_path, image_body)
    true
  rescue StandardError => error
    Rails.logger.warn("OG image generation failed: #{error.class} #{error.message}")
    false
  end

  def self.storage_path_for(post)
    Rails.root.join("public", "og-images", "#{post.public_slug}.#{IMAGE_FORMAT}")
  end

  def self.render_html(post)
    excerpt = truncate_content(ActionController::Base.helpers.strip_tags(post.content), 180)
    published_date = (post.published_at || Time.current).strftime("%B %d, %Y")

    ApplicationController.render(
      template: "public/posts/og_image",
      assigns: {
        post: post,
        excerpt: excerpt,
        published_date: published_date
      },
      layout: false,
      formats: [:html]
    )
  end

  def self.html2png_url(html)
    uri = URI("https://html2png.dev/api/convert")
    uri.query = {
      width: IMAGE_WIDTH,
      height: IMAGE_HEIGHT,
      format: IMAGE_FORMAT,
      deviceScaleFactor: 2
    }.to_query

    request = Net::HTTP::Post.new(uri)
    request["Content-Type"] = "text/html; charset=UTF-8"
    request.body = html

    response = Net::HTTP.start(uri.host, uri.port, use_ssl: true) do |http|
      http.request(request)
    end

    return unless response.is_a?(Net::HTTPSuccess)

    body = JSON.parse(response.body)
    body["url"]
  rescue JSON::ParserError, SocketError, Errno::ECONNREFUSED, Timeout::Error => error
    Rails.logger.warn("html2png conversion failed: #{error.class} #{error.message}")
    nil
  end

  def self.download_image(url)
    uri = URI.parse(url)
    response = Net::HTTP.get_response(uri)
    return unless response.is_a?(Net::HTTPSuccess)

    response.body
  rescue SocketError, Errno::ECONNREFUSED, Timeout::Error => error
    Rails.logger.warn("OG image download failed: #{error.class} #{error.message}")
    nil
  end

  def self.truncate_content(content, length)
    return "" if content.blank?

    stripped = content.strip
    if stripped.length > length
      "#{stripped[0, length]}..."
    else
      stripped
    end
  end

  private_class_method :render_html, :html2png_url, :download_image, :truncate_content
end
