# frozen_string_literal: true

class Keystroke < ApplicationRecord
  belongs_to :document, optional: true
  belongs_to :verification, optional: true

  enum :event_type, {keydown: 0, keyup: 1}

  validates :event_type, presence: true
  validates :key_code, presence: true
  validates :timestamp, presence: true
  validates :cursor_position, presence: true
  validates :sequence_number, presence: true, uniqueness: {scope: [:document_id, :verification_id]}
  validate :belongs_to_document_or_verification

  scope :ordered, -> { order(:sequence_number, :timestamp) }
  scope :for_document, ->(document) { where(document: document) }
  scope :for_verification, ->(verification) { where(verification: verification) }

  private

  def belongs_to_document_or_verification
    return if document_id.present? || verification_id.present?

    errors.add(:base, "Keystroke must belong to a document or verification")
  end
end
