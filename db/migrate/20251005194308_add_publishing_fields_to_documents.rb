# frozen_string_literal: true

class AddPublishingFieldsToDocuments < ActiveRecord::Migration[8.0]
  def change
    # published_at already exists, only add missing fields
    add_column :documents, :public_slug, :string
    add_column :documents, :word_count, :integer, default: 0
    add_column :documents, :reading_time_minutes, :integer, default: 0
    add_column :documents, :keystroke_count, :integer, default: 0
    
    add_index :documents, :public_slug, unique: true, where: "public_slug IS NOT NULL"
    # published_at index already exists
  end
end
