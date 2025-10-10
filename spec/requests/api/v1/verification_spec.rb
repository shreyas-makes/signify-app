# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Api::V1::Verification', type: :request do
  let(:user) { create(:user) }
  let(:document) { create(:document, :published, user: user, content: 'Hello world! This is a test document.') }
  
  describe 'GET /api/v1/posts/:public_slug/verify' do
    context 'with keystroke data' do
      let!(:keystrokes) { create_natural_keystroke_sequence(document) }

      it 'returns comprehensive verification analysis' do
        get "/api/v1/posts/#{document.public_slug}/verify"

        expect(response).to have_http_status(:ok)
        expect(response.content_type).to include('application/json')

        json = JSON.parse(response.body)
        expect(json).to have_key('document_info')
        expect(json).to have_key('data_integrity')
        expect(json).to have_key('authenticity_analysis')
        expect(json).to have_key('statistical_analysis')
        expect(json).to have_key('verification_summary')
        expect(json).to have_key('generated_at')
      end

      it 'includes correct document information' do
        get "/api/v1/posts/#{document.public_slug}/verify"

        json = JSON.parse(response.body)
        doc_info = json['document_info']

        expect(doc_info['title']).to eq(document.title)
        expect(doc_info['public_slug']).to eq(document.public_slug)
        expect(doc_info['word_count']).to eq(document.word_count)
        expect(doc_info['keystroke_count']).to eq(keystrokes.count)
        expect(doc_info['author']).to eq(user.display_name)
      end

      it 'performs data integrity checks' do
        get "/api/v1/posts/#{document.public_slug}/verify"

        json = JSON.parse(response.body)
        integrity = json['data_integrity']

        expect(integrity).to have_key('sequence_integrity')
        expect(integrity).to have_key('temporal_consistency')
        expect(integrity).to have_key('data_completeness')
        expect(integrity).to have_key('duplicate_detection')

        # With properly created test data, these should pass
        expect(integrity['sequence_integrity']['valid']).to be true
        expect(integrity['temporal_consistency']['valid']).to be true
        expect(integrity['duplicate_detection']['has_duplicates']).to be false
      end

      it 'provides authenticity analysis' do
        get "/api/v1/posts/#{document.public_slug}/verify"

        json = JSON.parse(response.body)
        authenticity = json['authenticity_analysis']

        expect(authenticity).to have_key('natural_typing_patterns')
        expect(authenticity).to have_key('timing_variance')
        expect(authenticity).to have_key('pause_patterns')
        expect(authenticity).to have_key('keystroke_rhythm')

        # Natural keystroke sequence should be detected as authentic
        expect(authenticity['natural_typing_patterns']['detected']).to be true
        expect(authenticity['natural_typing_patterns']['confidence']).to be > 50
      end

      it 'includes statistical analysis' do
        get "/api/v1/posts/#{document.public_slug}/verify"

        json = JSON.parse(response.body)
        stats = json['statistical_analysis']

        expect(stats).to have_key('total_keystrokes')
        expect(stats).to have_key('writing_session')
        expect(stats).to have_key('typing_speed')
        expect(stats).to have_key('character_distribution')

        expect(stats['total_keystrokes']).to eq(keystrokes.count)
        expect(stats['typing_speed']).to have_key('words_per_minute')
      end

      it 'provides verification summary' do
        get "/api/v1/posts/#{document.public_slug}/verify"

        json = JSON.parse(response.body)
        summary = json['verification_summary']

        expect(summary).to have_key('overall_status')
        expect(summary).to have_key('confidence_level')
        expect(summary).to have_key('key_findings')
        expect(summary).to have_key('recommendations')

        expect(summary['confidence_level']).to be_between(0, 100)
        expect(summary['key_findings']).to be_an(Array)
      end
    end

    context 'without keystroke data' do
      it 'returns verification analysis for document with no keystrokes' do
        get "/api/v1/posts/#{document.public_slug}/verify"

        expect(response).to have_http_status(:ok)
        
        json = JSON.parse(response.body)
        expect(json['document_info']['keystroke_count']).to eq(0)
        expect(json['verification_summary']['overall_status']).to eq('unverified')
        expect(json['verification_summary']['confidence_level']).to eq(0)
      end
    end

    context 'with suspicious keystroke patterns' do
      let!(:suspicious_keystrokes) { create_suspicious_keystroke_sequence(document) }

      it 'detects unnatural patterns' do
        get "/api/v1/posts/#{document.public_slug}/verify"

        json = JSON.parse(response.body)
        authenticity = json['authenticity_analysis']

        expect(authenticity['natural_typing_patterns']['detected']).to be false
        expect(authenticity['natural_typing_patterns']['confidence']).to be < 50
      end

      it 'provides appropriate recommendations' do
        get "/api/v1/posts/#{document.public_slug}/verify"

        json = JSON.parse(response.body)
        summary = json['verification_summary']

        expect(summary['overall_status']).to include('unverified')
        expect(summary['recommendations']).to include('Manual review recommended')
      end
    end

    context 'with data integrity issues' do
      let!(:broken_keystrokes) { create_broken_keystroke_sequence(document) }

      it 'detects sequence integrity problems' do
        get "/api/v1/posts/#{document.public_slug}/verify"

        json = JSON.parse(response.body)
        integrity = json['data_integrity']

        expect(integrity['sequence_integrity']['valid']).to be false
        expect(integrity['sequence_integrity']['missing_count']).to be > 0
      end

      it 'detects duplicate keystrokes' do
        # Create duplicate sequence numbers
        create(:keystroke, document: document, sequence_number: 1)
        create(:keystroke, document: document, sequence_number: 1)

        get "/api/v1/posts/#{document.public_slug}/verify"

        json = JSON.parse(response.body)
        integrity = json['data_integrity']

        expect(integrity['duplicate_detection']['has_duplicates']).to be true
        expect(integrity['duplicate_detection']['duplicate_sequences']).to include(1)
      end
    end

    context 'when post does not exist' do
      it 'returns 404 error' do
        get '/api/v1/posts/nonexistent-post/verify'

        expect(response).to have_http_status(:not_found)
        json = JSON.parse(response.body)
        expect(json['error']).to eq('Post not found')
      end
    end

    context 'when post is not published' do
      let(:draft_document) { create(:document, :draft, user: user) }

      it 'returns 404 error' do
        get "/api/v1/posts/#{draft_document.slug}/verify"

        expect(response).to have_http_status(:not_found)
        json = JSON.parse(response.body)
        expect(json['error']).to eq('Post not found')
      end
    end

    context 'rate limiting' do
      it 'applies rate limiting after multiple requests' do
        # Make 20 requests (at the limit)
        20.times do
          get "/api/v1/posts/#{document.public_slug}/verify"
          expect(response).to have_http_status(:ok)
        end

        # 21st request should be rate limited
        get "/api/v1/posts/#{document.public_slug}/verify"
        expect(response).to have_http_status(:too_many_requests)
        
        json = JSON.parse(response.body)
        expect(json['error']).to include('Rate limit exceeded')
      end
    end

    context 'CORS headers' do
      it 'includes proper CORS headers' do
        get "/api/v1/posts/#{document.public_slug}/verify"

        expect(response.headers['Access-Control-Allow-Origin']).to eq('*')
        expect(response.headers['Access-Control-Allow-Methods']).to eq('GET')
        expect(response.headers['Access-Control-Allow-Headers']).to eq('Content-Type')
      end
    end
  end

  describe 'performance with large datasets' do
    let!(:many_keystrokes) { create_natural_keystroke_sequence(document, count: 2000) }

    it 'responds within reasonable time for large verification' do
      start_time = Time.current
      get "/api/v1/posts/#{document.public_slug}/verify"
      end_time = Time.current

      expect(response).to have_http_status(:ok)
      expect(end_time - start_time).to be < 3.seconds
    end
  end

  describe 'verification accuracy' do
    context 'with known good data' do
      let!(:keystrokes) { create_natural_keystroke_sequence(document, count: 100) }

      it 'correctly identifies natural typing patterns' do
        get "/api/v1/posts/#{document.public_slug}/verify"

        json = JSON.parse(response.body)
        authenticity = json['authenticity_analysis']

        expect(authenticity['natural_typing_patterns']['detected']).to be true
        expect(authenticity['timing_variance']['natural_variance']).to be true
        expect(authenticity['pause_patterns']['natural_pattern']).to be true
      end

      it 'calculates reasonable typing speed' do
        get "/api/v1/posts/#{document.public_slug}/verify"

        json = JSON.parse(response.body)
        typing_speed = json['statistical_analysis']['typing_speed']

        expect(typing_speed['words_per_minute']).to be_between(10, 120) # Reasonable WPM range
        expect(typing_speed['keystrokes_per_minute']).to be > 0
      end
    end

    context 'with known bad data' do
      let!(:keystrokes) { create_robotic_keystroke_sequence(document) }

      it 'correctly identifies automated typing patterns' do
        get "/api/v1/posts/#{document.public_slug}/verify"

        json = JSON.parse(response.body)
        authenticity = json['authenticity_analysis']

        expect(authenticity['natural_typing_patterns']['detected']).to be false
        expect(authenticity['timing_variance']['natural_variance']).to be false
      end
    end
  end

  private

  def create_natural_keystroke_sequence(document, count: 50)
    keystrokes = []
    base_time = 1.hour.ago
    
    count.times do |i|
      # Simulate natural typing with variance
      interval = rand(0.1..0.8) # Random interval between keystrokes
      base_time += interval.seconds
      
      keystrokes << create(:keystroke,
        document: document,
        sequence_number: i + 1,
        timestamp: base_time,
        event_type: 'keydown',
        key_code: rand(65..90), # A-Z
        character: ('A'..'Z').to_a.sample,
        cursor_position: i
      )
    end
    
    keystrokes
  end

  def create_suspicious_keystroke_sequence(document)
    keystrokes = []
    base_time = 1.hour.ago
    
    # Create unnaturally uniform timing
    20.times do |i|
      base_time += 0.1.seconds # Exactly 100ms between each keystroke (suspicious)
      
      keystrokes << create(:keystroke,
        document: document,
        sequence_number: i + 1,
        timestamp: base_time,
        event_type: 'keydown',
        key_code: 65 + (i % 26),
        character: ('A'..'Z').to_a[i % 26],
        cursor_position: i
      )
    end
    
    keystrokes
  end

  def create_broken_keystroke_sequence(document)
    keystrokes = []
    base_time = 1.hour.ago
    
    # Create sequence with gaps (missing sequence numbers)
    [1, 2, 3, 5, 6, 8, 10].each_with_index do |seq_num, i|
      base_time += rand(0.1..0.5).seconds
      
      keystrokes << create(:keystroke,
        document: document,
        sequence_number: seq_num,
        timestamp: base_time,
        event_type: 'keydown',
        key_code: 65 + i,
        character: ('A'..'G').to_a[i],
        cursor_position: i
      )
    end
    
    keystrokes
  end

  def create_robotic_keystroke_sequence(document)
    keystrokes = []
    base_time = 1.hour.ago
    
    # Create perfectly uniform timing (robotic)
    30.times do |i|
      base_time += 0.05.seconds # Exactly 50ms - too fast and uniform for humans
      
      keystrokes << create(:keystroke,
        document: document,
        sequence_number: i + 1,
        timestamp: base_time,
        event_type: 'keydown',
        key_code: 65 + (i % 26),
        character: ('A'..'Z').to_a[i % 26],
        cursor_position: i
      )
    end
    
    keystrokes
  end
end