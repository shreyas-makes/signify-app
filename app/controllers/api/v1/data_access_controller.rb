# frozen_string_literal: true

require 'csv'

class Api::V1::DataAccessController < ApplicationController
  skip_before_action :authenticate
  before_action :set_post
  before_action :apply_rate_limiting
  after_action :set_cors_headers

  # GET /api/v1/posts/:public_slug/data
  # Returns complete keystroke data in JSON or CSV format
  def show
    unless @post
      render json: { error: "Post not found" }, status: :not_found
      return
    end

    format = params[:format]&.downcase || "json"
    
    case format
    when "json"
      render_json_data
    when "csv"
      render_csv_data
    else
      render json: { error: "Unsupported format. Use 'json' or 'csv'" }, status: :bad_request
    end
  end

  private

  def set_post
    @post = Document.published.find_by(public_slug: params[:public_slug])
  end

  def apply_rate_limiting
    # Simple rate limiting: 10 requests per minute per IP
    cache_key = "data_access_rate_limit:#{request.remote_ip}"
    current_count = Rails.cache.read(cache_key) || 0
    
    if current_count >= 10
      render json: { 
        error: "Rate limit exceeded. Maximum 10 requests per minute." 
      }, status: :too_many_requests
      return
    end
    
    Rails.cache.write(cache_key, current_count + 1, expires_in: 1.minute)
  end

  def set_cors_headers
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
  end

  def render_json_data
    keystrokes = @post.keystrokes.ordered
    
    data = {
      document: {
        id: @post.id,
        title: @post.title,
        subtitle: @post.subtitle,
        public_slug: @post.public_slug,
        published_at: @post.published_at.iso8601,
        word_count: @post.word_count,
        reading_time_minutes: @post.reading_time_minutes,
        keystroke_count: keystrokes.count,
        character_count: @post.content&.length || 0,
        author: {
          display_name: @post.user.display_name
        }
      },
      keystrokes: keystrokes.map do |keystroke|
        {
          sequence_number: keystroke.sequence_number,
          event_type: keystroke.event_type,
          key_code: keystroke.key_code,
          character: keystroke.character,
          timestamp: keystroke.timestamp.to_f,
          cursor_position: keystroke.cursor_position,
          metadata: {
            created_at: keystroke.created_at.iso8601
          }
        }
      end,
      data_format: {
        version: "1.0",
        timestamp_unit: "seconds_since_epoch",
        total_keystrokes: keystrokes.count,
        exported_at: Time.current.iso8601
      }
    }

    render json: data
  end

  def render_csv_data
    keystrokes = @post.keystrokes.ordered
    
    csv_data = CSV.generate(headers: true) do |csv|
      # Header row
      csv << [
        'sequence_number',
        'event_type', 
        'key_code',
        'character',
        'timestamp',
        'cursor_position',
        'created_at'
      ]
      
      # Data rows
      keystrokes.each do |keystroke|
        csv << [
          keystroke.sequence_number,
          keystroke.event_type,
          keystroke.key_code,
          keystroke.character,
          keystroke.timestamp.to_f,
          keystroke.cursor_position,
          keystroke.created_at.iso8601
        ]
      end
    end

    filename = "#{@post.public_slug}-keystrokes-#{Date.current.strftime('%Y%m%d')}.csv"
    
    respond_to do |format|
      format.csv do
        send_data csv_data, 
          filename: filename,
          type: 'text/csv',
          disposition: 'attachment'
      end
      format.json do
        render json: { csv_data: csv_data, filename: filename }
      end
    end
  end
end
