# frozen_string_literal: true

class SandboxController < InertiaController
  skip_before_action :authenticate
  before_action :perform_authentication

  def index
  end

  def v1
  end

  def v2
  end

  def v3
  end
end
