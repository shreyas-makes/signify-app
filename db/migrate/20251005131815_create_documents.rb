# frozen_string_literal: true

class CreateDocuments < ActiveRecord::Migration[8.0]
  def change
    create_table :documents do |t|
      t.string :title, null: false
      t.text :content
      t.string :slug
      t.integer :status
      t.references :user, null: false, foreign_key: true
      t.datetime :published_at

      t.timestamps
    end
    add_index :documents, :slug, unique: true
    add_index :documents, :status
    add_index :documents, :published_at
  end
end
