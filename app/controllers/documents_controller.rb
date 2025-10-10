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
    timestamp = Time.current.strftime("%Y%m%d_%H%M%S")
    @document = Current.user.documents.create!(
      title: "Untitled Document #{timestamp}",
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
    render inertia: "documents/edit", props: {
      document: document_json(@document)
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
    params.require(:document).permit(:title, :content, :status)
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
    
    keystroke_data.each do |keystroke_params|
      # Only create new keystrokes - avoid duplicates by checking sequence number
      unless @document.keystrokes.exists?(sequence_number: keystroke_params[:sequence_number])
        # Convert relative timestamp to absolute timestamp
        absolute_timestamp = Time.current - (keystroke_params[:timestamp].to_f / 1000).seconds
        
        @document.keystrokes.create!(
          event_type: keystroke_params[:event_type],
          key_code: keystroke_params[:key_code].to_s,
          character: keystroke_params[:character],
          timestamp: absolute_timestamp,
          sequence_number: keystroke_params[:sequence_number],
          cursor_position: keystroke_params[:cursor_position] || 0
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