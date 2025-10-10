# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Document Data Downloads', type: :request do
  let(:user) { create(:user) }
  let(:document) { create(:document, user: user) }
  let!(:keystrokes) { create_list(:keystroke, 15, document: document) }

  before do
    sign_in_as(user)
  end

  describe 'GET /documents/:id/download_data' do
    context 'JSON format' do
      it 'downloads complete document data as JSON' do
        get "/documents/#{document.id}/download_data", params: { format: 'json' }

        expect(response).to have_http_status(:ok)
        expect(response.content_type).to include('application/json')
        expect(response.headers['Content-Disposition']).to include('attachment')
        
        filename = response.headers['Content-Disposition'].match(/filename="(.+)"/)[1]
        expect(filename).to include(document.slug)
        expect(filename).to include(Date.current.strftime('%Y%m%d'))
        expect(filename).to end_with('.json')
      end

      it 'includes complete document metadata' do
        get "/documents/#{document.id}/download_data", params: { format: 'json' }

        json = JSON.parse(response.body)
        doc_data = json['document']

        expect(doc_data['id']).to eq(document.id)
        expect(doc_data['title']).to eq(document.title)
        expect(doc_data['slug']).to eq(document.slug)
        expect(doc_data['public_slug']).to eq(document.public_slug)
        expect(doc_data['status']).to eq(document.status)
        expect(doc_data['content']).to eq(document.content)
        expect(doc_data['word_count']).to eq(document.word_count)
        expect(doc_data['keystroke_count']).to eq(keystrokes.count)
        expect(doc_data['author']['display_name']).to eq(user.display_name)
      end

      it 'includes all keystroke data with full details' do
        get "/documents/#{document.id}/download_data", params: { format: 'json' }

        json = JSON.parse(response.body)
        keystroke_data = json['keystrokes']

        expect(keystroke_data.length).to eq(keystrokes.count)
        
        first_keystroke = keystroke_data.first
        expect(first_keystroke).to have_key('id')
        expect(first_keystroke).to have_key('sequence_number')
        expect(first_keystroke).to have_key('event_type')
        expect(first_keystroke).to have_key('key_code')
        expect(first_keystroke).to have_key('character')
        expect(first_keystroke).to have_key('timestamp')
        expect(first_keystroke).to have_key('cursor_position')
        expect(first_keystroke).to have_key('created_at')
        expect(first_keystroke).to have_key('updated_at')
      end

      it 'includes export metadata' do
        get "/documents/#{document.id}/download_data", params: { format: 'json' }

        json = JSON.parse(response.body)
        metadata = json['export_metadata']

        expect(metadata['export_format']).to eq('json')
        expect(metadata['total_keystrokes']).to eq(keystrokes.count)
        expect(metadata['data_version']).to eq('1.0')
        expect(metadata).to have_key('exported_at')
      end

      it 'preserves data accuracy' do
        keystroke = keystrokes.first
        get "/documents/#{document.id}/download_data", params: { format: 'json' }

        json = JSON.parse(response.body)
        api_keystroke = json['keystrokes'].find { |k| k['id'] == keystroke.id }

        expect(api_keystroke['sequence_number']).to eq(keystroke.sequence_number)
        expect(api_keystroke['event_type']).to eq(keystroke.event_type)
        expect(api_keystroke['key_code']).to eq(keystroke.key_code)
        expect(api_keystroke['character']).to eq(keystroke.character)
        expect(api_keystroke['timestamp']).to eq(keystroke.timestamp.to_f)
        expect(api_keystroke['cursor_position']).to eq(keystroke.cursor_position)
      end
    end

    context 'CSV format' do
      it 'downloads keystroke data as CSV' do
        get "/documents/#{document.id}/download_data", params: { format: 'csv' }

        expect(response).to have_http_status(:ok)
        expect(response.content_type).to include('text/csv')
        expect(response.headers['Content-Disposition']).to include('attachment')
        
        filename = response.headers['Content-Disposition'].match(/filename="(.+)"/)[1]
        expect(filename).to include(document.slug)
        expect(filename).to include(Date.current.strftime('%Y%m%d'))
        expect(filename).to end_with('.csv')
      end

      it 'includes proper CSV headers' do
        get "/documents/#{document.id}/download_data", params: { format: 'csv' }

        csv_lines = response.body.split("\n")
        headers = csv_lines.first.split(',')

        expected_headers = [
          'id', 'sequence_number', 'event_type', 'key_code',
          'character', 'timestamp', 'cursor_position', 'created_at', 'updated_at'
        ]
        expect(headers).to eq(expected_headers)
      end

      it 'includes all keystroke data rows' do
        get "/documents/#{document.id}/download_data", params: { format: 'csv' }

        csv_lines = response.body.split("\n")
        data_rows = csv_lines[1..-1] # Exclude header row
        
        expect(data_rows.length).to eq(keystrokes.count)
        expect(data_rows.all? { |row| row.split(',').length == 9 }).to be true
      end

      it 'maintains data integrity in CSV format' do
        keystroke = keystrokes.first
        get "/documents/#{document.id}/download_data", params: { format: 'csv' }

        csv_lines = response.body.split("\n")
        # Find the row with our keystroke
        data_row = csv_lines.find { |line| line.start_with?(keystroke.id.to_s + ',') }
        
        expect(data_row).to be_present
        data_fields = data_row.split(',')
        
        expect(data_fields[0].to_i).to eq(keystroke.id)
        expect(data_fields[1].to_i).to eq(keystroke.sequence_number)
        expect(data_fields[2]).to eq(keystroke.event_type)
        expect(data_fields[3]).to eq(keystroke.key_code)
        expect(data_fields[4]).to eq(keystroke.character)
        expect(data_fields[5].to_f).to eq(keystroke.timestamp.to_f)
        expect(data_fields[6].to_i).to eq(keystroke.cursor_position)
      end
    end

    context 'unsupported format' do
      it 'redirects with error for unsupported format' do
        get "/documents/#{document.id}/download_data", params: { format: 'xml' }

        expect(response).to have_http_status(:found)
        follow_redirect!
        
        expect(response.body).to include('Unsupported format')
      end
    end

    context 'default format' do
      it 'defaults to JSON when no format specified' do
        get "/documents/#{document.id}/download_data"

        expect(response).to have_http_status(:ok)
        expect(response.content_type).to include('application/json')
        
        json = JSON.parse(response.body)
        expect(json).to have_key('document')
        expect(json).to have_key('keystrokes')
        expect(json).to have_key('export_metadata')
      end
    end

    context 'authorization' do
      let(:other_user) { create(:user) }
      let(:other_document) { create(:document, user: other_user) }

      it 'prevents downloading other users documents' do
        expect {
          get "/documents/#{other_document.id}/download_data"
        }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    context 'authentication' do
      before { sign_out }

      it 'requires authentication' do
        get "/documents/#{document.id}/download_data"

        expect(response).to have_http_status(:found)
        expect(response.location).to include('/sign_in')
      end
    end

    context 'nonexistent document' do
      it 'returns 404 for nonexistent document' do
        expect {
          get "/documents/99999/download_data"
        }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    context 'document without keystrokes' do
      let(:empty_document) { create(:document, user: user) }

      it 'downloads document with empty keystroke array' do
        get "/documents/#{empty_document.id}/download_data", params: { format: 'json' }

        expect(response).to have_http_status(:ok)
        
        json = JSON.parse(response.body)
        expect(json['keystrokes']).to eq([])
        expect(json['export_metadata']['total_keystrokes']).to eq(0)
      end

      it 'creates CSV with headers only for empty keystrokes' do
        get "/documents/#{empty_document.id}/download_data", params: { format: 'csv' }

        expect(response).to have_http_status(:ok)
        
        csv_lines = response.body.split("\n")
        expect(csv_lines.length).to eq(1) # Header only
        expect(csv_lines.first).to include('sequence_number,event_type')
      end
    end
  end

  describe 'performance with large datasets' do
    let!(:many_keystrokes) { create_list(:keystroke, 5000, document: document) }

    it 'handles large JSON downloads efficiently' do
      start_time = Time.current
      get "/documents/#{document.id}/download_data", params: { format: 'json' }
      end_time = Time.current

      expect(response).to have_http_status(:ok)
      expect(end_time - start_time).to be < 5.seconds
      
      json = JSON.parse(response.body)
      expect(json['keystrokes'].length).to eq(5000)
    end

    it 'handles large CSV downloads efficiently' do
      start_time = Time.current
      get "/documents/#{document.id}/download_data", params: { format: 'csv' }
      end_time = Time.current

      expect(response).to have_http_status(:ok)
      expect(end_time - start_time).to be < 5.seconds
      
      csv_lines = response.body.split("\n")
      expect(csv_lines.length).to eq(5001) # 5000 data rows + 1 header
    end
  end

  describe 'filename generation' do
    it 'creates safe filenames for documents with special characters' do
      special_doc = create(:document, user: user, title: 'My "Special" Document & More!')
      
      get "/documents/#{special_doc.id}/download_data", params: { format: 'json' }

      filename = response.headers['Content-Disposition'].match(/filename="(.+)"/)[1]
      expect(filename).to match(/\A[a-z0-9\-]+\.json\z/) # Only safe characters
    end

    it 'includes current date in filename' do
      get "/documents/#{document.id}/download_data", params: { format: 'csv' }

      filename = response.headers['Content-Disposition'].match(/filename="(.+)"/)[1]
      expect(filename).to include(Date.current.strftime('%Y%m%d'))
    end
  end

  private

  def sign_out
    delete session_path(1) if Current.session
  end
end