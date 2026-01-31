# frozen_string_literal: true

class Public::UserFeedsController < InertiaController
  skip_before_action :authenticate, only: [:show]

  def show
    user = User.find_by(username: params[:username])
    unless user
      render inertia: "errors/not_found", status: :not_found
      return
    end

    verifications = user.verifications.order(created_at: :desc)

    render inertia: "public/user_feeds/show", props: {
      user: user_json(user),
      verifications: verifications_json(verifications),
      meta: user_meta_tags(user)
    }
  end

  private

  def user_json(user)
    {
      display_name: user.display_name,
      username: user.username,
      bio: user.bio,
      member_since: user.created_at&.strftime("%B %Y")
    }
  end

  def verifications_json(verifications)
    verifications.map do |verification|
      paste = verification.paste_events || {}
      occurred = paste["occurred"] == true || paste["occurred"] == "true" || paste[:occurred] == true
      count = paste["count"] || paste[:count] || 0

      {
        id: verification.public_id,
        status: verification.status,
        platform: verification.platform,
        created_at: verification.created_at.strftime("%B %d, %Y"),
        paste: {
          occurred: occurred,
          count: count.to_i
        },
        public_url: public_verification_path(verification.public_id)
      }
    end
  end

  def user_meta_tags(user)
    {
      title: "#{user.display_name} - Proofs of Authorship",
      description: "Verification feed for #{user.display_name} on Signify.",
      canonical_url: "#{request.base_url}#{public_user_feed_path(user.username)}",
      author: user.display_name
    }
  end
end
