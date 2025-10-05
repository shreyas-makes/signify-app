# frozen_string_literal: true

class DocumentsController < InertiaController
  before_action :set_document, only: [:edit, :update, :destroy]

  def index
    @documents = Current.user.documents.order(updated_at: :desc)
    
    render inertia: "documents/index", props: {
      documents: @documents.map do |document|
        {
          id: document.id,
          title: document.title,
          slug: document.slug,
          status: document.status,
          content: document.content.present? ? document.content.truncate(100) : "",
          word_count: document.content.present? ? document.content.split.size : 0,
          created_at: document.created_at,
          updated_at: document.updated_at
        }
      end
    }
  end

  def new
    @document = Current.user.documents.build
    
    render inertia: "documents/new"
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
      render json: {
        document: document_json(@document),
        flash: { success: "Document saved." }
      }
    else
      render json: inertia_errors(@document), status: :unprocessable_content
    end
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

  private

  def set_document
    @document = Current.user.documents.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render inertia: "errors/not_found", status: :not_found
  end

  def document_params
    params.require(:document).permit(:title, :content, :status)
  end

  def document_json(document)
    {
      id: document.id,
      title: document.title,
      slug: document.slug,
      status: document.status,
      content: document.content || "",
      word_count: document.content.present? ? document.content.split.size : 0,
      created_at: document.created_at,
      updated_at: document.updated_at
    }
  end
end