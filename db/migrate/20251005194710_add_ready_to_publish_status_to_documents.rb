# frozen_string_literal: true

class AddReadyToPublishStatusToDocuments < ActiveRecord::Migration[8.0]
  def change
    # No schema changes needed - enum values are handled in the model
    # This migration serves as documentation for the status workflow enhancement
  end
end
