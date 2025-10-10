# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Api::V1::DataAccess', type: :request do
  let(:user) { create(:user) }
  let(:document) { create(:document, :published, user: user) }
  let!(:keystrokes) { create_list(:keystroke, 10, document: document) }

  describe 'GET /api/v1/posts/:public_slug/data' do
    context 'when post exists' do
      context 'JSON format' do
        it 'returns complete keystroke data' do
          get "/api/v1/posts/#{document.public_slug}/data"

          expect(response).to have_http_status(:ok)
          expect(response.content_type).to include('application/json')

          json = JSON.parse(response.body)
          expect(json).to have_key('document')
          expect(json).to have_key('keystrokes')
          expect(json).to have_key('data_format')
        end

        it 'includes correct document metadata' do
          get "/api/v1/posts/#{document.public_slug}/data"

          json = JSON.parse(response.body)
          doc_data = json['document']

          expect(doc_data['id']).to eq(document.id)
          expect(doc_data['title']).to eq(document.title)
          expect(doc_data['public_slug']).to eq(document.public_slug)
          expect(doc_data['word_count']).to eq(document.word_count)
          expect(doc_data['keystroke_count']).to eq(keystrokes.count)
          expect(doc_data['author']['display_name']).to eq(user.display_name)
        end

        it 'includes all keystroke data with correct format' do
          get "/api/v1/posts/#{document.public_slug}/data"

          json = JSON.parse(response.body)
          keystroke_data = json['keystrokes']

          expect(keystroke_data.length).to eq(keystrokes.count)
          
          first_keystroke = keystroke_data.first
          expect(first_keystroke).to have_key('sequence_number')
          expect(first_keystroke).to have_key('event_type')
          expect(first_keystroke).to have_key('key_code')
          expect(first_keystroke).to have_key('character')
          expect(first_keystroke).to have_key('timestamp')
          expect(first_keystroke).to have_key('cursor_position')
        end

        it 'includes proper data format metadata' do
          get "/api/v1/posts/#{document.public_slug}/data"

          json = JSON.parse(response.body)
          format_data = json['data_format']

          expect(format_data['version']).to eq('1.0')
          expect(format_data['timestamp_unit']).to eq('seconds_since_epoch')
          expect(format_data['total_keystrokes']).to eq(keystrokes.count)
          expect(format_data).to have_key('exported_at')
        end

        it 'orders keystrokes by sequence number' do
          get "/api/v1/posts/#{document.public_slug}/data"

          json = JSON.parse(response.body)
          keystroke_data = json['keystrokes']
          sequence_numbers = keystroke_data.map { |k| k['sequence_number'] }

          expect(sequence_numbers).to eq(sequence_numbers.sort)
        end
      end

      context 'CSV format' do
        it 'returns CSV data with correct headers' do
          get "/api/v1/posts/#{document.public_slug}/data", params: { format: 'csv' }

          expect(response).to have_http_status(:ok)
          expect(response.content_type).to include('application/json')

          json = JSON.parse(response.body)
          csv_data = json['csv_data']
          lines = csv_data.split("\n")

          # Check headers
          headers = lines.first.split(',')
          expected_headers = [
            'sequence_number', 'event_type', 'key_code', 
            'character', 'timestamp', 'cursor_position', 'created_at'
          ]
          expect(headers).to eq(expected_headers)

          # Check data rows
          expect(lines.length).to eq(keystrokes.count + 1) # +1 for header
        end

        it 'includes proper filename' do
          get "/api/v1/posts/#{document.public_slug}/data", params: { format: 'csv' }

          json = JSON.parse(response.body)
          filename = json['filename']
          expected_filename = "#{document.public_slug}-keystrokes-#{Date.current.strftime('%Y%m%d')}.csv"

          expect(filename).to eq(expected_filename)
        end
      end

      context 'unsupported format' do
        it 'returns error for unsupported format' do
          get "/api/v1/posts/#{document.public_slug}/data", params: { format: 'xml' }

          expect(response).to have_http_status(:bad_request)
          json = JSON.parse(response.body)
          expect(json['error']).to include('Unsupported format')
        end
      end
    end

    context 'when post does not exist' do
      it 'returns 404 error' do
        get '/api/v1/posts/nonexistent-post/data'

        expect(response).to have_http_status(:not_found)
        json = JSON.parse(response.body)
        expect(json['error']).to eq('Post not found')
      end
    end

    context 'when post is not published' do
      let(:draft_document) { create(:document, :draft, user: user) }

      it 'returns 404 error' do
        get "/api/v1/posts/#{draft_document.slug}/data"

        expect(response).to have_http_status(:not_found)
        json = JSON.parse(response.body)
        expect(json['error']).to eq('Post not found')
      end
    end

    context 'rate limiting' do
      before do
        # Clear any existing rate limit cache
        Rails.cache.clear
      end

      it 'applies rate limiting after multiple requests' do
        # Make 10 requests (at the limit)
        10.times do
          get "/api/v1/posts/#{document.public_slug}/data"
          expect(response).to have_http_status(:ok)
        end

        # 11th request should be rate limited
        get "/api/v1/posts/#{document.public_slug}/data"
        expect(response).to have_http_status(:too_many_requests)
        
        json = JSON.parse(response.body)
        expect(json['error']).to include('Rate limit exceeded')
      end
    end

    context 'CORS headers' do
      it 'includes proper CORS headers' do
        get "/api/v1/posts/#{document.public_slug}/data"

        expect(response.headers['Access-Control-Allow-Origin']).to eq('*')
        expect(response.headers['Access-Control-Allow-Methods']).to eq('GET')
        expect(response.headers['Access-Control-Allow-Headers']).to eq('Content-Type')
      end
    end
  end

  describe 'performance' do
    context 'with large dataset' do
      let!(:many_keystrokes) { create_list(:keystroke, 1000, document: document) }

      it 'responds within reasonable time for large datasets' do
        start_time = Time.current
        get "/api/v1/posts/#{document.public_slug}/data"
        end_time = Time.current

        expect(response).to have_http_status(:ok)
        expect(end_time - start_time).to be < 2.seconds

        json = JSON.parse(response.body)
        expect(json['keystrokes'].length).to eq(1000)
      end
    end
  end

  describe 'data accuracy' do
    let(:keystroke) { keystrokes.first }

    it 'preserves all keystroke data accurately' do
      get "/api/v1/posts/#{document.public_slug}/data"

      json = JSON.parse(response.body)
      api_keystroke = json['keystrokes'].find { |k| k['sequence_number'] == keystroke.sequence_number }

      expect(api_keystroke['event_type']).to eq(keystroke.event_type)
      expect(api_keystroke['key_code']).to eq(keystroke.key_code)
      expect(api_keystroke['character']).to eq(keystroke.character)
      expect(api_keystroke['timestamp']).to eq(keystroke.timestamp.to_f)
      expect(api_keystroke['cursor_position']).to eq(keystroke.cursor_position)
    end

    it 'maintains timestamp precision' do
      # Create keystroke with specific timestamp
      precise_time = Time.current
      precise_keystroke = create(:keystroke, document: document, timestamp: precise_time)

      get "/api/v1/posts/#{document.public_slug}/data"

      json = JSON.parse(response.body)
      api_keystroke = json['keystrokes'].find { |k| k['sequence_number'] == precise_keystroke.sequence_number }

      expect(api_keystroke['timestamp']).to eq(precise_time.to_f)
    end
  end
end