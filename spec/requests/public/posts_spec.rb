# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Public::Posts', type: :request do
  let(:user) { create(:user) }
  let!(:published_document) { create(:document, :published, user: user, title: 'Published Post', content: '<p>This is published content</p>') }
  let!(:draft_document) { create(:document, user: user, title: 'Draft Post', content: '<p>This is draft content</p>') }

  describe 'GET /posts' do
    it 'returns success' do
      get public_posts_path
      expect(response).to have_http_status(:success)
    end

    it 'does not require authentication' do
      get public_posts_path
      expect(response).to have_http_status(:success)
      expect(response).not_to redirect_to(sign_in_path)
    end

    it 'only shows published documents' do
      get public_posts_path
      expect(response).to have_http_status(:success)
      
      # Check that published post data is included
      expect(response.body).to include(published_document.title)
      expect(response.body).to include(published_document.public_slug)
      
      # Check that draft post is not included
      expect(response.body).not_to include(draft_document.title)
    end

    it 'supports search functionality' do
      get public_posts_path, params: { search: 'Published' }
      expect(response).to have_http_status(:success)
      expect(response.body).to include(published_document.title)
    end

    it 'returns empty results for search with no matches' do
      get public_posts_path, params: { search: 'NonexistentContent' }
      expect(response).to have_http_status(:success)
      expect(response.body).not_to include(published_document.title)
    end
  end

  describe 'GET /posts/:public_slug' do
    context 'with published document' do
      it 'returns success' do
        get public_post_path(published_document.public_slug)
        expect(response).to have_http_status(:success)
      end

      it 'does not require authentication' do
        get public_post_path(published_document.public_slug)
        expect(response).to have_http_status(:success)
        expect(response).not_to redirect_to(sign_in_path)
      end

      it 'includes meta data in Inertia props' do
        get public_post_path(published_document.public_slug)
        expect(response).to have_http_status(:success)
        expect(response.body).to include('public/posts/show')
      end

      it 'shows post content and metadata in props' do
        get public_post_path(published_document.public_slug)
        expect(response).to have_http_status(:success)
        expect(response.body).to include(published_document.title)
        expect(response.body).to include(user.display_name)
      end
    end

    context 'with nonexistent public_slug' do
      it 'returns 404' do
        get public_post_path('nonexistent-slug')
        expect(response).to have_http_status(:not_found)
      end

      it 'renders not found component' do
        get public_post_path('nonexistent-slug')
        expect(response.body).to include('errors/not_found')
      end
    end

    context 'with draft document public_slug' do
      before do
        draft_document.update!(public_slug: 'draft-slug')
      end

      it 'returns 404 for draft documents' do
        get public_post_path('draft-slug')
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'POST /posts/:public_slug/kudos' do
    it 'creates kudos for a visitor and sets a visitor cookie' do
      expect {
        post public_post_kudos_path(published_document.public_slug)
      }.to change { published_document.kudos.count }.by(1)

      expect(response).to have_http_status(:created)
      expect(response.headers['Set-Cookie']).to include(Public::PostsController::VISITOR_COOKIE_KEY.to_s)

      json = JSON.parse(response.body)
      expect(json['given']).to be true
      expect(json['kudos_count']).to eq(published_document.reload.kudos_count)
    end

    it 'does not create duplicate kudos for the same visitor' do
      cookies.signed[Public::PostsController::VISITOR_COOKIE_KEY] = 'visitor-123'

      post public_post_kudos_path(published_document.public_slug)
      expect(response).to have_http_status(:created)

      expect {
        post public_post_kudos_path(published_document.public_slug)
      }.not_to change { published_document.kudos.count }

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['given']).to be true
    end

    it 'returns 404 for non-existent posts' do
      post public_post_kudos_path('missing-post')

      expect(response).to have_http_status(:not_found)
      json = JSON.parse(response.body)
      expect(json['error']).to eq('Post not found')
    end
  end

  describe 'Security and Performance' do
    it 'does not expose private document data' do
      get public_posts_path
      expect(response.body).not_to include(draft_document.title)
      expect(response.body).not_to include('draft')
      expect(response.body).not_to include('ready_to_publish')
    end

    it 'includes security headers' do
      get public_posts_path
      expect(response.headers['X-Frame-Options']).to be_present
      expect(response.headers['X-Content-Type-Options']).to be_present
    end

    it 'handles large content efficiently' do
      large_content = '<p>' + 'A' * 10000 + '</p>'
      large_post = create(:document, :published, user: user, content: large_content)
      
      start_time = Time.current
      get public_post_path(large_post.public_slug)
      end_time = Time.current
      
      expect(response).to have_http_status(:success)
      expect(end_time - start_time).to be < 2.seconds
    end
  end

  describe 'Content truncation' do
    let(:long_content) { '<p>' + 'Word ' * 100 + '</p>' }
    let!(:long_post) { create(:document, :published, user: user, content: long_content) }

    it 'truncates excerpts in listing' do
      get public_posts_path
      expect(response).to have_http_status(:success)
      # Excerpt should be truncated but still readable
      expect(response.body).to include('Word')
      expect(response.body).to include('...')
    end
  end
end
