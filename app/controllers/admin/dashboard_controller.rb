# frozen_string_literal: true

class Admin::DashboardController < Admin::BaseController
  def index
    @users = User.includes(:documents, :sessions).order(created_at: :desc).limit(50)
    @documents = Document.includes(:user).order(created_at: :desc).limit(50)
    @recent_posts = Document.published.includes(:user).order(published_at: :desc).limit(20)
    
    @stats = {
      total_users: User.count,
      total_documents: Document.count,
      published_posts: Document.published.count,
      total_keystrokes: Keystroke.count,
      users_today: User.where(created_at: 1.day.ago..).count,
      documents_today: Document.where(created_at: 1.day.ago..).count,
      posts_published_today: Document.where(published_at: 1.day.ago..).count
    }

    render inertia: "admin/dashboard", props: {
      users: @users.map { |user| admin_user_json(user) },
      documents: @documents.map { |doc| admin_document_json(doc) },
      recent_posts: @recent_posts.map { |post| admin_post_json(post) },
      stats: @stats
    }
  end

  private

  def admin_user_json(user)
    {
      id: user.id,
      name: user.name,
      display_name: user.display_name,
      email: user.email,
      verified: user.verified,
      admin: user.admin,
      documents_count: user.documents.count,
      published_count: user.documents.published.count,
      total_keystrokes: user.documents.joins(:keystrokes).count,
      created_at: user.created_at,
      last_session: user.sessions.order(created_at: :desc).first&.created_at
    }
  end

  def admin_document_json(document)
    {
      id: document.id,
      title: document.title,
      slug: document.slug,
      public_slug: document.public_slug,
      status: document.status,
      word_count: document.word_count,
      keystroke_count: document.keystroke_count,
      created_at: document.created_at,
      updated_at: document.updated_at,
      published_at: document.published_at,
      user: {
        id: document.user.id,
        name: document.user.name,
        display_name: document.user.display_name
      }
    }
  end

  def admin_post_json(post)
    {
      id: post.id,
      title: post.title,
      public_slug: post.public_slug,
      word_count: post.word_count,
      keystroke_count: post.keystroke_count,
      published_at: post.published_at,
      user: {
        id: post.user.id,
        display_name: post.user.display_name
      }
    }
  end
end