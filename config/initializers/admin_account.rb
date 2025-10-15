# frozen_string_literal: true

# Ensure an admin account exists based on environment configuration.
Rails.application.config.to_prepare do
  admin_email = ENV["ADMIN_EMAIL"]
  admin_password = ENV["ADMIN_PASSWORD"]

  next if admin_email.blank? || admin_password.blank?

  admin_name = ENV.fetch("ADMIN_NAME", "Administrator")
  admin_display_name = ENV.fetch("ADMIN_DISPLAY_NAME", admin_name)
  force_password_reset = ActiveModel::Type::Boolean.new.cast(
    ENV["ADMIN_FORCE_PASSWORD_RESET"]
  )

  admin_user = User.find_or_initialize_by(email: admin_email)
  admin_user.name = admin_name
  admin_user.display_name = admin_display_name
  admin_user.verified = true
  admin_user.admin = true

  needs_password_reset =
    force_password_reset ||
    admin_user.new_record? ||
    admin_user.password_digest.blank? ||
    (admin_user.persisted? && admin_password.present? && !admin_user.authenticate(admin_password))

  if needs_password_reset
    admin_user.password = admin_password
    admin_user.password_confirmation = admin_password
  end

  if admin_user.changed?
    begin
      admin_user.save!
      Rails.logger.info("Admin account ensured for #{admin_email}.")
    rescue ActiveRecord::RecordInvalid => e
      Rails.logger.error("Failed to ensure admin account: #{e.record.errors.full_messages.to_sentence}")
    end
  end
end
