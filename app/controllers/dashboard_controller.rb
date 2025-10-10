# frozen_string_literal: true

class DashboardController < InertiaController
  def index
    # Search and filtering
    documents_scope = Current.user.documents
    
    if params[:search].present?
      search_term = "%#{params[:search].strip}%"
      documents_scope = documents_scope.where(
        "title LIKE ? OR content LIKE ?", 
        search_term, search_term
      )
    end
    
    if params[:status].present? && params[:status] != 'all'
      documents_scope = documents_scope.where(status: params[:status])
    end
    
    # Sorting
    sort_column = params[:sort] || 'updated_at'
    sort_direction = params[:direction] || 'desc'
    
    case sort_column
    when 'title'
      documents_scope = documents_scope.order(title: sort_direction)
    when 'created_at'
      documents_scope = documents_scope.order(created_at: sort_direction)
    when 'word_count'
      documents_scope = documents_scope.order(word_count: sort_direction)
    when 'status'
      documents_scope = documents_scope.order(status: sort_direction)
    else
      documents_scope = documents_scope.order(updated_at: sort_direction)
    end
    
    # Pagination
    page = params[:page]&.to_i || 1
    per_page = 12
    
    @documents = documents_scope.offset((page - 1) * per_page).limit(per_page)
    total_documents = documents_scope.count
    total_pages = (total_documents.to_f / per_page).ceil
    
    # Statistics
    all_documents = Current.user.documents
    # Get real-time keystroke count from keystrokes table
    total_keystrokes = Current.user.documents.joins(:keystrokes).count
    statistics = {
      total_documents: all_documents.count,
      draft_count: all_documents.drafts.count,
      ready_to_publish_count: all_documents.ready_to_publish.count,
      published_count: all_documents.published.count,
      total_words: all_documents.sum(:word_count),
      total_keystrokes: total_keystrokes,
      avg_reading_time: all_documents.average(:reading_time_minutes)&.round(1) || 0
    }
    
    render inertia: "dashboard/index", props: {
      documents: @documents.map { |document| document_list_json(document) },
      pagination: {
        current_page: page,
        total_pages: total_pages,
        total_documents: total_documents,
        per_page: per_page
      },
      filters: {
        search: params[:search] || '',
        status: params[:status] || 'all',
        sort: sort_column,
        direction: sort_direction
      },
      statistics: statistics
    }
  end

  def bulk_action
    document_ids = params[:document_ids] || []
    action = params[:bulk_action]
    
    documents = Current.user.documents.where(id: document_ids)
    
    case action
    when 'delete'
      # Only allow deletion of drafts
      draft_documents = documents.drafts
      deleted_count = draft_documents.count
      draft_documents.destroy_all
      
      render json: { 
        success: true, 
        message: "#{deleted_count} document(s) deleted successfully.",
        deleted_count: deleted_count
      }
    when 'mark_ready'
      updated_count = documents.where(status: :draft).update_all(status: :ready_to_publish)
      
      render json: { 
        success: true, 
        message: "#{updated_count} document(s) marked as ready to publish.",
        updated_count: updated_count
      }
    when 'mark_draft'
      # Only allow marking ready_to_publish documents as draft
      updated_count = documents.where(status: :ready_to_publish).update_all(status: :draft)
      
      render json: { 
        success: true, 
        message: "#{updated_count} document(s) marked as draft.",
        updated_count: updated_count
      }
    else
      render json: { success: false, message: "Invalid bulk action." }, status: :unprocessable_content
    end
  rescue => e
    render json: { success: false, message: "An error occurred: #{e.message}" }, status: :unprocessable_content
  end

  private

  def document_list_json(document)
    {
      id: document.id,
      title: document.title,
      slug: document.slug,
      status: document.status,
      content: document.content.present? ? ActionController::Base.helpers.strip_tags(document.content).truncate(100) : "",
      word_count: document.word_count,
      reading_time_minutes: document.reading_time_minutes,
      keystroke_count: document.keystrokes.count, # Real-time count from keystrokes table
      created_at: document.created_at,
      updated_at: document.updated_at,
      published_at: document.published_at
    }
  end
end
