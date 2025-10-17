# frozen_string_literal: true

class StartController < InertiaController
  before_action :redirect_if_onboarded, only: :show

  def show
    user = Current.user

    render inertia: "start/index", props: {
      user: {
        name: user.name,
        display_name: user.display_name,
        avatar_url: user.avatar_url,
        bio: user.bio,
        email: user.email
      }
    }
  end

  def update
    user = Current.user
    attributes = user_params
    attributes[:onboarded_at] = Time.current unless user.onboarded_at?

    if user.update(attributes)
      redirect_to dashboard_path, notice: "Profile saved. Welcome aboard!"
    else
      redirect_to start_path, inertia: inertia_errors(user)
    end
  end

  private

  def redirect_if_onboarded
    if Current.user&.onboarded_at?
      redirect_to dashboard_path
    end
  end

  def user_params
    params.permit(:name, :display_name, :avatar_url, :bio)
  end
end
