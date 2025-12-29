# frozen_string_literal: true

class SandboxController < InertiaController
  skip_before_action :authenticate
  before_action :perform_authentication

  def index
  end
end
