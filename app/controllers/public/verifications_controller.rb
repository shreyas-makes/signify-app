# frozen_string_literal: true

class Public::VerificationsController < InertiaController
  skip_before_action :authenticate, only: [:show]

  def show
    verification = Verification.includes(:user).find_by(public_id: params[:public_id])
    unless verification
      render inertia: "errors/not_found", status: :not_found
      return
    end

    render inertia: "public/verifications/show", props: {
      verification: verification_json(verification),
      keystrokes: keystrokes_json(verification.keystrokes.ordered),
      meta: verification_meta_tags(verification)
    }
  end

  private

  def verification_json(verification)
    paste = verification.paste_events || {}
    occurred = paste["occurred"] == true || paste["occurred"] == "true" || paste[:occurred] == true
    count = paste["count"] || paste[:count] || 0

    start_at = verification.start_at&.iso8601
    end_at = verification.end_at&.iso8601
    duration_seconds = if verification.start_at.present? && verification.end_at.present?
      (verification.end_at - verification.start_at).to_i
    end

    {
      id: verification.public_id,
      status: verification.status,
      platform: verification.platform,
      created_at: verification.created_at.iso8601,
      start_at: start_at,
      end_at: end_at,
      duration_seconds: duration_seconds,
      paste: {
        occurred: occurred,
        count: count.to_i
      },
      keystroke_stats: verification.keystroke_stats || {},
      author: {
        display_name: verification.user.display_name,
        username: verification.user.username,
        profile_url: public_user_feed_path(verification.user.username)
      }
    }
  end

  def keystrokes_json(keystrokes)
    keystrokes.map do |keystroke|
      {
        id: keystroke.id,
        event_type: keystroke.event_type,
        key_code: keystroke.key_code,
        character: keystroke.character,
        timestamp: (keystroke.timestamp.to_f * 1000).to_i,
        cursor_position: keystroke.cursor_position,
        sequence_number: keystroke.sequence_number
      }
    end
  end

  def verification_meta_tags(verification)
    status_label = verification.status == "mixed" ? "Mixed" : "Human Written"
    title = "#{status_label} Verification - Signify"
    description = "Proof of human authorship for a #{verification.platform} draft by #{verification.user.display_name}."

    {
      title: title,
      description: description,
      canonical_url: "#{request.base_url}#{public_verification_path(verification.public_id)}",
      author: verification.user.display_name
    }
  end
end
