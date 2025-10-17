# frozen_string_literal: true

class Keystroke < ApplicationRecord
  belongs_to :document

  enum :event_type, {keydown: 0, keyup: 1}

  validates :event_type, presence: true
  validates :key_code, presence: true
  validates :timestamp, presence: true
  validates :cursor_position, presence: true
  validates :sequence_number, presence: true, uniqueness: {scope: :document_id}

  scope :ordered, -> { order(:sequence_number, :timestamp) }
  scope :for_document, ->(document) { where(document: document) }
end
