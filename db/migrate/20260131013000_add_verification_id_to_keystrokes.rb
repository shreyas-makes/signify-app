# frozen_string_literal: true

class AddVerificationIdToKeystrokes < ActiveRecord::Migration[8.0]
  def change
    add_reference :keystrokes, :verification, foreign_key: true
    add_index :keystrokes, [:verification_id, :sequence_number], unique: true
    change_column_null :keystrokes, :document_id, true
  end
end
