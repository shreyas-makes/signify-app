# frozen_string_literal: true

class AddSubtitleToDocuments < ActiveRecord::Migration[8.0]
  def change
    add_column :documents, :subtitle, :string
  end
end
