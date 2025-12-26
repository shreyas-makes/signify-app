# frozen_string_literal: true

class Admin::DocumentsController < Admin::BaseController
  def update
    document = Document.find(params[:id])
    hidden_param = params[:hidden_from_public]

    if hidden_param.nil?
      redirect_back fallback_location: admin_dashboard_path,
                    alert: "Missing visibility flag."
      return
    end

    unless document.published?
      redirect_back fallback_location: admin_dashboard_path,
                    alert: "Only published posts can be shown or hidden."
      return
    end

    hidden = ActiveModel::Type::Boolean.new.cast(hidden_param)
    document.update!(hidden_from_public: hidden)

    notice = hidden ? "Post hidden from public list." : "Post visible on public list."
    redirect_back fallback_location: admin_dashboard_path, notice: notice
  rescue ActiveRecord::RecordNotFound
    redirect_back fallback_location: admin_dashboard_path,
                  alert: "Document not found."
  end
end
