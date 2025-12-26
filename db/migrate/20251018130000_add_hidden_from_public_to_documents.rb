# frozen_string_literal: true

class AddHiddenFromPublicToDocuments < ActiveRecord::Migration[8.0]
  def change
    add_column :documents, :hidden_from_public, :boolean, null: false, default: false
    add_index :documents, :hidden_from_public
  end
end
