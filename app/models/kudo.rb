# frozen_string_literal: true

class Kudo < ApplicationRecord
  belongs_to :document, counter_cache: true

  validates :visitor_id, presence: true
  validates :visitor_id, uniqueness: { scope: :document_id }
end
