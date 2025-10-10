# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Public Posts', type: :system do
  let(:user) { create(:user, display_name: 'John Writer') }
  let!(:published_post) do
    create(:document, :published, 
           user: user, 
           title: 'How to Write Authentically',
           content: '<p>This is a comprehensive guide about authentic writing. It covers many important topics and provides valuable insights for writers looking to improve their craft.</p>')
  end
  let!(:another_published_post) do
    create(:document, :published, 
           user: user, 
           title: 'The Art of Storytelling',
           content: '<p>Storytelling is an ancient art form that continues to evolve in the digital age.</p>')
  end
  let!(:draft_post) { create(:document, user: user, title: 'Draft Article', content: '<p>This is a draft</p>') }

  describe 'Public posts listing page' do
    before do
      visit '/posts'
    end

    it 'displays the page title and header' do
      expect(page).to have_title('Published Posts - Signify')
      expect(page).to have_text('Published Posts')
      expect(page).to have_text('Discover verified human-written content on Signify')
    end

    it 'shows only published posts' do
      expect(page).to have_text('How to Write Authentically')
      expect(page).to have_text('The Art of Storytelling')
      expect(page).not_to have_text('Draft Article')
    end

    it 'displays post metadata' do
      expect(page).to have_text('By John Writer')
      expect(page).to have_text('Verified')
      expect(page).to have_text('words')
      expect(page).to have_text('min read')
    end

    it 'shows search functionality' do
      expect(page).to have_field('Search posts...')
      expect(page).to have_button('Search')
    end

    it 'allows searching for posts' do
      fill_in 'Search posts...', with: 'Authentically'
      click_button 'Search'
      
      expect(page).to have_text('How to Write Authentically')
      expect(page).not_to have_text('The Art of Storytelling')
    end

    it 'shows no results message for empty search' do
      fill_in 'Search posts...', with: 'NonexistentContent'
      click_button 'Search'
      
      expect(page).to have_text('No posts found')
      expect(page).to have_text('Try adjusting your search terms.')
    end

    it 'navigates to individual posts when clicked' do
      click_on 'How to Write Authentically'
      
      expect(page).to have_current_path("/posts/#{published_post.public_slug}")
      expect(page).to have_text('How to Write Authentically')
    end

    it 'has a back to home button' do
      expect(page).to have_button('← Back to Home')
      click_button '← Back to Home'
      expect(page).to have_current_path('/')
    end
  end

  describe 'Individual post page' do
    before do
      visit "/posts/#{published_post.public_slug}"
    end

    it 'displays the post title and content' do
      expect(page).to have_title("#{published_post.title} - Signify")
      expect(page).to have_text('How to Write Authentically')
      expect(page).to have_text('This is a comprehensive guide about authentic writing')
    end

    it 'shows author and publication information' do
      expect(page).to have_text('By John Writer')
      expect(page).to have_text(published_post.published_at.strftime("%B %d, %Y"))
    end

    it 'displays post statistics' do
      expect(page).to have_text("#{published_post.word_count} words")
      expect(page).to have_text("#{published_post.reading_time_minutes} min read")
      expect(page).to have_text("#{published_post.keystroke_count} keystrokes")
    end

    it 'shows keystroke verification badge' do
      expect(page).to have_text('Keystroke Verified')
      expect(page).to have_text('verified keystrokes')
      expect(page).to have_text('ensuring authentic human authorship')
    end

    it 'includes share buttons' do
      expect(page).to have_text('Share this post')
      expect(page).to have_button('Twitter')
      expect(page).to have_button('Facebook')
      expect(page).to have_button('Copy Link')
    end

    it 'shows author section' do
      expect(page).to have_text('About the Author')
      expect(page).to have_text('John Writer is a verified writer on Signify')
    end

    it 'has navigation elements' do
      expect(page).to have_button('Back to Posts')
      expect(page).to have_button('Explore More Posts')
    end

    it 'navigates back to posts listing' do
      click_button 'Back to Posts'
      expect(page).to have_current_path('/posts')
    end
  end

  describe 'Share functionality' do
    before do
      visit "/posts/#{published_post.public_slug}"
    end

    it 'opens Twitter share window', js: true do
      # Mock window.open to avoid actual popup
      page.execute_script("window.open = function(url) { window.lastOpenedUrl = url; }")
      
      click_button 'Twitter'
      
      opened_url = page.evaluate_script("window.lastOpenedUrl")
      expect(opened_url).to include('twitter.com/intent/tweet')
      expect(opened_url).to include(CGI.escape(published_post.title))
    end

    it 'opens Facebook share window', js: true do
      page.execute_script("window.open = function(url) { window.lastOpenedUrl = url; }")
      
      click_button 'Facebook'
      
      opened_url = page.evaluate_script("window.lastOpenedUrl")
      expect(opened_url).to include('facebook.com/sharer')
    end
  end

  describe '404 handling' do
    it 'shows 404 page for nonexistent posts' do
      visit '/posts/nonexistent-slug'
      
      expect(page).to have_text('404')
      expect(page).to have_text('Page not found')
      expect(page).to have_text("The post you're looking for doesn't exist")
      expect(page).to have_button('Back to Posts')
    end

    it 'navigates back from 404 page' do
      visit '/posts/nonexistent-slug'
      click_button 'Back to Posts'
      
      expect(page).to have_current_path('/posts')
    end
  end

  describe 'SEO and meta tags' do
    before do
      visit "/posts/#{published_post.public_slug}"
    end

    it 'includes proper meta tags' do
      expect(page).to have_css('meta[name="description"]', visible: false)
      expect(page).to have_css('meta[name="author"]', visible: false)
      expect(page).to have_css('link[rel="canonical"]', visible: false)
    end

    it 'includes Open Graph tags' do
      expect(page).to have_css('meta[property="og:title"]', visible: false)
      expect(page).to have_css('meta[property="og:description"]', visible: false)
      expect(page).to have_css('meta[property="og:url"]', visible: false)
      expect(page).to have_css('meta[property="og:type"]', visible: false)
    end

    it 'includes Twitter Card tags' do
      expect(page).to have_css('meta[name="twitter:card"]', visible: false)
      expect(page).to have_css('meta[name="twitter:title"]', visible: false)
      expect(page).to have_css('meta[name="twitter:description"]', visible: false)
    end

    it 'includes structured data' do
      structured_data = page.find('script[type="application/ld+json"]', visible: false)
      json_data = JSON.parse(structured_data.text(:all))
      
      expect(json_data['@type']).to eq('Article')
      expect(json_data['headline']).to eq(published_post.title)
      expect(json_data['author']['name']).to eq(user.display_name)
    end
  end

  describe 'Responsive design' do
    it 'works on mobile devices', driver: :selenium_chrome_headless_mobile do
      visit '/posts'
      
      expect(page).to have_text('Published Posts')
      expect(page).to have_text('How to Write Authentically')
    end
  end

  describe 'Performance' do
    it 'loads pages quickly' do
      start_time = Time.current
      visit '/posts'
      end_time = Time.current
      
      expect(end_time - start_time).to be < 3.seconds
      expect(page).to have_text('Published Posts')
    end
  end
end