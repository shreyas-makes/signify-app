# frozen_string_literal: true

class Verification < ApplicationRecord
  belongs_to :user
  has_many :keystrokes, dependent: :destroy

  enum :status, { human_written: 0, mixed: 1 }

  validates :platform, presence: true, inclusion: { in: %w[twitter] }
  validates :content_hash, presence: true
  validates :status, presence: true
  validates :public_id, presence: true, uniqueness: true

  before_validation :set_defaults
  before_validation :generate_public_id, if: -> { public_id.blank? }

  def status_from_paste_events
    paste = paste_events || {}
    occurred = paste["occurred"] == true || paste["occurred"] == "true"
    occurred ? :mixed : :human_written
  end

  private

  def set_defaults
    self.keystroke_stats ||= {}
    self.paste_events ||= {}
    self.status ||= status_from_paste_events
  end

  def generate_public_id
    loop do
      self.public_id = SecureRandom.alphanumeric(10).downcase
      break unless self.class.exists?(public_id: public_id)
    end
  end
end
