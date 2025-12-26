# frozen_string_literal: true

require "net/http"

class Public::PostsController < InertiaController
  skip_before_action :authenticate, only: [:index, :show, :keystrokes, :og_image]
  before_action :perform_authentication, only: [:index, :show, :keystrokes]
  before_action :set_post, only: [:show, :keystrokes, :og_image]

  def index
    @posts = Document.public_visible
                     .includes(:user)
                     .order(published_at: :desc)
                     .limit(20)

    # Basic search functionality
    if params[:search].present?
      search_term = "%#{params[:search]}%"
      @posts = @posts.where(
        "title LIKE ? OR content LIKE ?", 
        search_term, 
        search_term
      )
    end

    render inertia: "public/posts/index", props: {
      posts: posts_json(@posts),
      search: params[:search]
    }
  end

  def show
    unless @post
      render inertia: "errors/not_found", status: :not_found
      return
    end

    render inertia: "public/posts/show", props: {
      post: detailed_post_json(@post),
      meta: post_meta_tags(@post)
    }
  end

  def keystrokes
    unless @post
      if request.xhr?
        render json: { error: "Post not found" }, status: :not_found
      else
        render inertia: "errors/not_found", status: :not_found
      end
      return
    end

    # Load keystrokes data for visualization with pagination for performance
    page = [params[:page].to_i, 1].max
    per_page = 1000 # Limit to 1000 keystrokes per request
    
    keystrokes = @post.keystrokes.ordered
                      .offset((page - 1) * per_page)
                      .limit(per_page)
    
    total_keystrokes = @post.keystrokes.count
    has_more = (page * per_page) < total_keystrokes
    
    if request.xhr? && (!request.respond_to?(:inertia?) || !request.inertia?)
      # Handle AJAX requests for pagination
      render json: {
        keystrokes: keystrokes_json(keystrokes),
        pagination: {
          current_page: page,
          has_more: has_more,
          total_keystrokes: total_keystrokes,
          per_page: per_page
        }
      }
    else
      # Handle initial page load with Inertia
      render inertia: "public/posts/keystrokes", props: {
        post: detailed_post_json(@post),
        keystrokes: keystrokes_json(keystrokes),
        meta: keystroke_meta_tags(@post),
        pagination: {
          current_page: page,
          has_more: has_more,
          total_keystrokes: total_keystrokes,
          per_page: per_page
        }
      }
    end
  end

  def og_image
    unless @post
      render plain: "Post not found", status: :not_found
      return
    end

    @excerpt = truncate_content(ActionController::Base.helpers.strip_tags(@post.content), 180)
    @published_date = @post.published_at.strftime("%B %d, %Y")

    html = render_to_string(formats: [:html], layout: false)
    image_url = html2png_url(html)

    if image_url.present?
      redirect_to image_url, allow_other_host: true
    else
      render plain: "OG image unavailable", status: :service_unavailable
    end
  end

  private

  def set_post
    @post = Document.public_visible.find_by(public_slug: params[:public_slug])
  end

  def posts_json(posts)
    posts.map do |post|
      {
        id: post.id,
        title: post.title,
        subtitle: post.subtitle,
        public_slug: post.public_slug,
        published_at: post.published_at.strftime("%B %d, %Y"),
        word_count: post.word_count,
        reading_time_minutes: post.reading_time_minutes,
        author: {
          display_name: post.user.display_name,
          profile_url: public_author_path(post.user)
        },
        excerpt: truncate_content(post.content, 200)
      }
    end
  end

  def detailed_post_json(post)
    # Get a small sample of keystrokes for mini graph visualization
    sample_keystrokes = post.keystrokes.ordered.limit(50)
    is_owner = Current.user&.id == post.user_id
    
    {
      id: post.id,
      title: post.title,
      subtitle: post.subtitle,
      content: post.content,
      public_slug: post.public_slug,
      published_at: post.published_at.strftime("%B %d, %Y at %I:%M %p"),
      word_count: post.word_count,
      reading_time_minutes: post.reading_time_minutes,
      keystroke_count: post.keystroke_count,
      author: {
        id: post.user.id,
        name: post.user.name,
        display_name: post.user.display_name,
        avatar_url: post.user.avatar_image_url,
        bio: post.user.bio,
        profile_url: public_author_path(post.user)
      },
      verification: {
        keystroke_verified: post.keystroke_count > 0,
        total_keystrokes: post.keystroke_count
      },
      sample_keystrokes: keystrokes_json(sample_keystrokes),
      can_edit: is_owner,
      dashboard_path: is_owner ? dashboard_path : nil
    }
  end

  def post_meta_tags(post)
    {
      title: "#{post.title} - Signify",
      description: truncate_content(ActionController::Base.helpers.strip_tags(post.content), 160),
      author: post.user.display_name,
      published_time: post.published_at.iso8601,
      canonical_url: public_post_url(post.public_slug),
      og_title: post.title,
      og_description: truncate_content(ActionController::Base.helpers.strip_tags(post.content), 200),
      og_url: public_post_url(post.public_slug),
      og_image: public_post_og_image_url(post.public_slug),
      og_type: "article",
      twitter_card: "summary_large_image"
    }
  end

  def keystrokes_json(keystrokes)
    keystrokes.map do |keystroke|
      {
        id: keystroke.id,
        event_type: keystroke.event_type,
        key_code: keystroke.key_code,
        character: keystroke.character,
        timestamp: keystroke.timestamp.to_f * 1000, # Convert to milliseconds
        cursor_position: keystroke.cursor_position,
        sequence_number: keystroke.sequence_number
      }
    end
  end

  def keystroke_meta_tags(post)
    {
      title: "#{post.title} - Keystroke Timeline - Signify",
      description: "View the keystroke-by-keystroke verification of \"#{post.title}\" by #{post.user.display_name}. See authentic human writing patterns and timing.",
      author: post.user.display_name,
      published_time: post.published_at.iso8601,
      canonical_url: public_post_keystrokes_url(post.public_slug),
      og_title: "#{post.title} - Keystroke Verification",
      og_description: "Watch the keystroke-by-keystroke creation of this verified human-written content.",
      og_url: public_post_keystrokes_url(post.public_slug),
      og_type: "article",
      twitter_card: "summary_large_image"
    }
  end

  def truncate_content(content, length)
    return "" if content.blank?
    
    stripped = ActionController::Base.helpers.strip_tags(content).strip
    if stripped.length > length
      "#{stripped[0, length]}..."
    else
      stripped
    end
  end

  def html2png_url(html)
    uri = URI("https://html2png.dev/api/convert")
    uri.query = {
      width: 1200,
      height: 630,
      format: "png",
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
end
