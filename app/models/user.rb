# frozen_string_literal: true

require "digest/sha2"
require "uri"

class User < ApplicationRecord
  has_secure_password

  generates_token_for :email_verification, expires_in: 2.days do
    email
  end

  generates_token_for :password_reset, expires_in: 20.minutes do
    password_salt.last(10)
  end


  has_many :sessions, dependent: :destroy
  has_many :documents, dependent: :destroy

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true, format: {with: URI::MailTo::EMAIL_REGEXP}
  validates :password, allow_nil: true, length: {minimum: 12}
  validates :display_name, presence: true, length: {maximum: 100}
  validates :bio, length: { maximum: 500 }, allow_blank: true

  normalizes :email, with: -> { _1.strip.downcase }

  before_validation if: :email_changed?, on: :update do
    self.verified = false
  end

  after_update if: :password_digest_previously_changed? do
    sessions.where.not(id: Current.session).delete_all
  end

  # Admin functionality
  def admin?
    admin == true
  end

  def make_admin!
    update!(admin: true)
  end

  def avatar_image_url
    normalized = avatar_url.to_s.strip
    if normalized.match?(/\Ahttps?:\/\//i)
      if gravatar_profile_url?(normalized)
        avatar_from_profile = gravatar_avatar_from_profile(normalized)
        return avatar_from_profile if avatar_from_profile.present?
        return
      end
      return normalized
    end

    gravatar_id = gravatar_id_from(normalized) || gravatar_id_from(email.to_s)

    return gravatar_url(gravatar_id) if gravatar_id.present?
    return if normalized.blank?

    normalized
  end

  private

  def gravatar_id_from(value)
    cleaned = value.strip.downcase
    return if cleaned.blank?
    return cleaned if cleaned.match?(/\A[0-9a-f]{32}\z/) || cleaned.match?(/\A[0-9a-f]{64}\z/)
    return Digest::SHA256.hexdigest(cleaned) if cleaned.include?("@")

    nil
  end

  def gravatar_url(hash)
    "https://www.gravatar.com/avatar/#{hash}?d=identicon"
  end

  def gravatar_profile_url?(value)
    uri = URI.parse(value)
    return false unless uri.host&.include?("gravatar.com")

    path = uri.path.to_s
    !path.start_with?("/avatar/")
  rescue URI::InvalidURIError
    false
  end

  def gravatar_avatar_from_profile(value)
    slug = gravatar_profile_slug(value)
    return if slug.blank?

    Gravatar::ProfileLookup.new(slug).avatar_url
  end

  def gravatar_profile_slug(value)
    uri = URI.parse(value)
    return if uri.host.blank?

    host = uri.host.downcase
    return unless host.end_with?("gravatar.com")

    slug = uri.path.to_s.sub(%r{\A/}, "")
    slug.presence
  rescue URI::InvalidURIError
    nil
  end
end
