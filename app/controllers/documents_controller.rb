# frozen_string_literal: true

class DocumentsController < InertiaController
  before_action :set_document, only: [:edit, :update, :destroy, :publish, :download_data]

  def index
    @documents = Current.user.documents.order(updated_at: :desc)
    
    render inertia: "documents/index", props: {
      documents: @documents.map { |document| document_json(document) }
    }
  end

  def new
    # Auto-create a blank document instead of showing a form
    @document = Current.user.documents.create!(
      title: "",
      content: "",
      status: :draft
    )
    
    redirect_to edit_document_path(@document), notice: "New document created."
  end

  def create
    @document = Current.user.documents.build(document_params)
    
    if @document.save
      redirect_to edit_document_path(@document), notice: "Document created successfully."
    else
      render inertia: "documents/new", props: inertia_errors(@document)
    end
  end

  def edit
    # Get all user documents for sidebar
    documents = Current.user.documents.order(updated_at: :desc)
    
    render inertia: "documents/edit", props: {
      document: document_json(@document),
      documents: documents.map { |doc| document_json(doc) },
      keystrokes: @document.keystrokes.order(:sequence_number).map do |keystroke|
        {
          id: keystroke.id,
          event_type: keystroke.event_type,
          key_code: keystroke.key_code,
          character: keystroke.character,
          timestamp: keystroke.timestamp.iso8601,
          sequence_number: keystroke.sequence_number,
          cursor_position: keystroke.cursor_position
        }
      end
    }
  end

  def update
    if @document.update(document_params)
      # Process keystroke data if provided
      if params[:keystrokes].present?
        process_keystrokes(params[:keystrokes])
      end
      
      # For AJAX requests (auto-save), return JSON
      if request.xhr?
        render json: {
          document: document_json(@document),
          flash: { success: "Document saved." }
        }
      else
        # For form submissions, redirect with Inertia
        redirect_to edit_document_path(@document), notice: "Document saved."
      end
    else
      if request.xhr?
        render json: inertia_errors(@document), status: :unprocessable_content
      else
        render inertia: "documents/edit", props: {
          document: document_json(@document),
          **inertia_errors(@document)
        }
      end
    end
  end

  def publish
    unless @document.can_edit?
      redirect_to edit_document_path(@document), alert: "Document is already published."
      return
    end

    # Validate publishing requirements
    unless valid_for_publishing?
      redirect_to edit_document_path(@document), alert: "Document doesn't meet publishing requirements."
      return
    end

    Document.transaction do
      # Create immutable snapshot by updating status
      @document.update!(status: :published)
    end

    redirect_to edit_document_path(@document), notice: "Document published successfully! Your keystroke-verified post is now live."
  rescue ActiveRecord::RecordInvalid => e
    redirect_to edit_document_path(@document), alert: "Publishing failed: #{e.record.errors.full_messages.join(', ')}"
  end

  def destroy
    if @document.published?
      # Soft delete for published documents
      @document.update(status: :draft)
      flash[:notice] = "Document unpublished successfully."
    else
      # Hard delete for drafts
      @document.destroy
      flash[:notice] = "Document deleted successfully."
    end
    
    redirect_to documents_path
  end

  def download_data
    format = params[:format]&.downcase || "json"
    
    case format
    when "json"
      send_json_data
    when "csv"
      send_csv_data
    else
      redirect_to edit_document_path(@document), alert: "Unsupported format. Use 'json' or 'csv'"
    end
  end

  private

  def set_document
    @document = Current.user.documents.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render inertia: "errors/not_found", status: :not_found
  end

  def document_params
    permitted = params.require(:document).permit(:title, :content, :status)
    
    # Sanitize input parameters
    permitted[:title] = sanitize_title(permitted[:title]) if permitted[:title]
    permitted[:content] = sanitize_content(permitted[:content]) if permitted[:content]
    permitted[:status] = sanitize_status(permitted[:status]) if permitted[:status]
    
    permitted
  end

  def sanitize_title(title)
    # Strip dangerous characters and limit length
    ActionController::Base.helpers.strip_tags(title.to_s)
      .gsub(/[<>\"'&]/, '')
      .strip
      .truncate(255)
  end

  def sanitize_content(content)
    # Allow basic formatting but strip dangerous tags
    ActionController::Base.helpers.sanitize(content.to_s, 
      tags: %w[p br strong b em i u ol ul li blockquote],
      attributes: {}
    )
  end

  def sanitize_status(status)
    # Only allow valid status values
    %w[draft ready_to_publish published].include?(status.to_s) ? status.to_s : 'draft'
  end

  def sanitize_keystroke_params(params)
    # Validate required fields
    return nil unless params[:sequence_number].present?
    return nil unless params[:timestamp].present?
    return nil unless params[:event_type].present?

    # Validate event_type
    valid_event_types = %w[keydown keyup]
    return nil unless valid_event_types.include?(params[:event_type].to_s)

    # Sanitize and validate parameters
    {
      sequence_number: params[:sequence_number].to_i,
      timestamp: [params[:timestamp].to_f, 0].max, # Ensure non-negative
      event_type: params[:event_type].to_s,
      key_code: params[:key_code].to_s.strip.truncate(20),
      character: sanitize_character(params[:character]),
      cursor_position: [params[:cursor_position].to_i, 0].max
    }
  rescue => e
    Rails.logger.warn "Invalid keystroke params: #{e.message}"
    nil
  end

  def sanitize_character(character)
    return nil if character.blank?
    
    # Only allow printable characters and common control characters
    char = character.to_s.strip
    return nil if char.length > 10 # Prevent abuse
    
    # Allow printable ASCII and some Unicode, but strip dangerous characters
    char.gsub(/[<>\"'&]/, '')
  end

  def valid_for_publishing?
    return false if @document.title.blank?
    return false if @document.content.blank?
    return false if @document.keystrokes.count == 0
    
    true
  end

  def document_json(document)
    {
      id: document.id,
      title: document.title,
      slug: document.slug,
      public_slug: document.public_slug,
      status: document.status,
      content: document.content || "",
      word_count: document.content.present? ? calculate_word_count(document.content) : 0,
      published_at: document.published_at,
      created_at: document.created_at,
      updated_at: document.updated_at
    }
  end
  

  def calculate_word_count(html_content)
    return 0 if html_content.blank?
    
    # Strip HTML tags and count words
    text_content = ActionController::Base.helpers.strip_tags(html_content)
    text_content.strip.blank? ? 0 : text_content.strip.split(/\s+/).size
  end

  def process_keystrokes(keystroke_data)
    return unless keystroke_data.is_a?(Array)
    
    # Limit the number of keystrokes processed at once
    keystroke_data = keystroke_data.first(1000) if keystroke_data.length > 1000
    
    keystroke_data.each do |keystroke_params|
      # Sanitize keystroke parameters
      sanitized_params = sanitize_keystroke_params(keystroke_params)
      next unless sanitized_params
      
      # Only create new keystrokes - avoid duplicates by checking sequence number
      unless @document.keystrokes.exists?(sequence_number: sanitized_params[:sequence_number])
        # Convert relative timestamp to absolute timestamp
        absolute_timestamp = Time.current - (sanitized_params[:timestamp].to_f / 1000).seconds
        
        @document.keystrokes.create!(
          event_type: sanitized_params[:event_type],
          key_code: sanitized_params[:key_code],
          character: sanitized_params[:character],
          timestamp: absolute_timestamp,
          sequence_number: sanitized_params[:sequence_number],
          cursor_position: sanitized_params[:cursor_position]
        )
      end
    end
    
    # Update the document's keystroke count after adding new keystrokes
    @document.update_column(:keystroke_count, @document.keystrokes.count)
    
    Rails.logger.info "Processed #{keystroke_data.length} keystrokes for document #{@document.id}"
  rescue => e
    Rails.logger.error "Error processing keystrokes: #{e.message}"
  end

  def send_json_data
    keystrokes = @document.keystrokes.ordered
    
    data = {
      document: {
        id: @document.id,
        title: @document.title,
        slug: @document.slug,
        public_slug: @document.public_slug,
        status: @document.status,
        content: @document.content,
        word_count: @document.word_count,
        reading_time_minutes: @document.reading_time_minutes,
        keystroke_count: @document.keystroke_count,
        character_count: @document.content&.length || 0,
        created_at: @document.created_at.iso8601,
        updated_at: @document.updated_at.iso8601,
        published_at: @document.published_at&.iso8601,
        author: {
          display_name: @document.user.display_name
        }
      },
      keystrokes: keystrokes.map do |keystroke|
        {
          id: keystroke.id,
          sequence_number: keystroke.sequence_number,
          event_type: keystroke.event_type,
          key_code: keystroke.key_code,
          character: keystroke.character,
          timestamp: keystroke.timestamp.to_f,
          cursor_position: keystroke.cursor_position,
          created_at: keystroke.created_at.iso8601,
          updated_at: keystroke.updated_at.iso8601
        }
      end,
      export_metadata: {
        exported_at: Time.current.iso8601,
        export_format: "json",
        total_keystrokes: keystrokes.count,
        data_version: "1.0"
      }
    }

    filename = "#{@document.slug}-data-#{Date.current.strftime('%Y%m%d')}.json"
    
    send_data data.to_json, 
      filename: filename,
      type: 'application/json',
      disposition: 'attachment'
  end

  def send_csv_data
    require 'csv'
    
    keystrokes = @document.keystrokes.ordered
    
    csv_data = CSV.generate(headers: true) do |csv|
      # Header row
      csv << [
        'id',
        'sequence_number',
        'event_type', 
        'key_code',
        'character',
        'timestamp',
        'cursor_position',
        'created_at',
        'updated_at'
      ]
      
      # Data rows
      keystrokes.each do |keystroke|
        csv << [
          keystroke.id,
          keystroke.sequence_number,
          keystroke.event_type,
          keystroke.key_code,
          keystroke.character,
          keystroke.timestamp.to_f,
          keystroke.cursor_position,
          keystroke.created_at.iso8601,
          keystroke.updated_at.iso8601
        ]
      end
    end

    filename = "#{@document.slug}-keystrokes-#{Date.current.strftime('%Y%m%d')}.csv"
    
    send_data csv_data, 
      filename: filename,
      type: 'text/csv',
      disposition: 'attachment'
  end
end