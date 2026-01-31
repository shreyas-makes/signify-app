# frozen_string_literal: true

class CreateVerifications < ActiveRecord::Migration[8.0]
  def change
    create_table :verifications do |t|
      t.references :user, null: false, foreign_key: true
      t.string :platform, null: false
      t.string :content_hash, null: false
      t.integer :status, null: false, default: 0
      t.json :keystroke_stats, null: false, default: {}
      t.json :paste_events, null: false, default: {}
      t.datetime :start_at
      t.datetime :end_at
      t.string :public_id, null: false

      t.timestamps
    end

    add_index :verifications, :public_id, unique: true
    add_index :verifications, [:user_id, :created_at]
  end
end
