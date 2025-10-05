# frozen_string_literal: true

class CreateKeystrokes < ActiveRecord::Migration[8.0]
  def change
    create_table :keystrokes do |t|
      t.references :document, null: false, foreign_key: true
      t.integer :event_type
      t.string :key_code
      t.string :character
      t.datetime :timestamp, precision: 6
      t.integer :sequence_number

      t.timestamps
    end
    add_index :keystrokes, [:document_id, :sequence_number]
    add_index :keystrokes, :timestamp
  end
end
