# frozen_string_literal: true

class ExtensionAuthCode < ApplicationRecord
  belongs_to :user

  validates :code, presence: true, uniqueness: true
  validates :redirect_uri, presence: true
  validates :expires_at, presence: true

  before_validation :ensure_code, on: :create
  before_validation :set_expires_at, on: :create

  def expired?
    expires_at.present? && expires_at < Time.current
  end

  def redeemed?
    redeemed_at.present?
  end

  def redeem!
    update!(redeemed_at: Time.current)
  end

  def self.consume(code, state: nil)
    record = find_by(code: code)
    return nil unless record
    return nil if record.redeemed? || record.expired?
    if state.present? && record.state.present? && record.state != state
      return nil
    end

    record
  end

  private

  def ensure_code
    return if code.present?

    self.code = SecureRandom.hex(32)
  end

  def set_expires_at
    self.expires_at ||= 10.minutes.from_now
  end
end
