# frozen_string_literal: true

class Public::PostsController < InertiaController
  VISITOR_COOKIE_KEY = :public_visitor_id

  skip_before_action :authenticate, only: [:index, :show, :keystrokes, :kudos]
  before_action :perform_authentication, only: [:index, :show, :keystrokes, :kudos]
  before_action :ensure_visitor_id, only: [:index, :show, :keystrokes, :kudos]
  before_action :set_post, only: [:show, :keystrokes, :kudos]

  def index
    @posts = Document.public_visible
                     .includes(:user)
                     .order(kudos_count: :desc, published_at: :desc)
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

    @meta = post_meta_tags(@post)

    render inertia: "public/posts/show", props: {
      post: detailed_post_json(@post),
      meta: @meta
    }
  end

  def kudos
    unless @post
      render json: { error: "Post not found" }, status: :not_found
      return
    end

    existing_kudos = @post.kudos.find_by(visitor_id: visitor_id)
    if existing_kudos
      render json: { kudos_count: @post.kudos_count, given: true }, status: :ok
      return
    end

    kudos = @post.kudos.new(visitor_id: visitor_id)
    if kudos.save
      @post.reload
      render json: { kudos_count: @post.kudos_count, given: true }, status: :created
    else
      render json: { error: "Unable to give kudos" }, status: :unprocessable_entity
    end
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
      @meta = keystroke_meta_tags(@post)
      render inertia: "public/posts/keystrokes", props: {
        post: detailed_post_json(@post),
        keystrokes: keystrokes_json(keystrokes),
        meta: @meta,
        pagination: {
          current_page: page,
          has_more: has_more,
          total_keystrokes: total_keystrokes,
          per_page: per_page
        }
      }
    end
  end

  private

  def set_post
    @post = Document.public_visible.find_by(public_slug: params[:public_slug])
  end

  def ensure_visitor_id
    return if cookies.signed[VISITOR_COOKIE_KEY].present?

    cookies.signed.permanent[VISITOR_COOKIE_KEY] = {
      value: SecureRandom.uuid,
      httponly: true,
      same_site: :lax
    }
  end

  def visitor_id
    cookies.signed[VISITOR_COOKIE_KEY]
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
        kudos_count: post.kudos_count,
        author: {
          display_name: post.user.display_name,
          profile_url: public_user_feed_path(post.user.username)
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
      kudos_count: post.kudos_count,
      kudos_given: visitor_id.present? ? post.kudos.exists?(visitor_id: visitor_id) : false,
      author: {
        id: post.user.id,
        name: post.user.name,
        display_name: post.user.display_name,
        avatar_url: post.user.avatar_image_url,
        bio: post.user.bio,
        profile_url: public_user_feed_path(post.user.username)
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

end
