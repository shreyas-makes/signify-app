# frozen_string_literal: true

class Admin::BaseController < InertiaController
  before_action :require_admin

  private

  def require_admin
    unless Current.user&.admin?
      render inertia: "errors/not_found", status: :not_found
    end
  end
end