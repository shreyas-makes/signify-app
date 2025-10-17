# frozen_string_literal: true

class Public::AuthorsController < ApplicationController
  skip_before_action :authenticate, only: [:show]
  before_action :set_author

  def show
    unless @author
      render inertia: "errors/not_found", status: :not_found
      return
    end

    posts = @author.documents
                   .published
                   .where.not(public_slug: nil)
                   .order(published_at: :desc)

    render inertia: "public/authors/show", props: {
      author: author_json(@author, posts.count),
      posts: posts_json(posts),
      meta: author_meta_tags(@author)
    }
  end

  private

  def set_author
    @author = User.find_by(id: params[:id])
  end

  def author_json(user, published_count)
    {
      id: user.id,
      display_name: user.display_name,
      bio: user.bio,
      member_since: user.created_at&.strftime("%B %Y"),
      published_count: published_count
    }
  end

  def posts_json(posts)
    posts.map do |post|
      {
        id: post.id,
        title: post.title,
        public_slug: post.public_slug,
        published_at: post.published_at&.strftime("%B %d, %Y"),
        word_count: post.word_count,
        reading_time_minutes: post.reading_time_minutes,
        excerpt: truncate_content(post.content, 200)
      }
    end
  end

  def author_meta_tags(author)
    {
      title: "#{author.display_name} - Published Work",
      description: author.bio.presence || "Explore published posts written by #{author.display_name} on Signify.",
      canonical_url: "#{request.base_url}#{public_author_path(author)}",
      author: author.display_name
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
