# frozen_string_literal: true

class CreateKudosAndAddKudosCountToDocuments < ActiveRecord::Migration[8.0]
  def change
    create_table :kudos do |t|
      t.references :document, null: false, foreign_key: true
      t.string :visitor_id, null: false
      t.timestamps
    end

    add_index :kudos, [:document_id, :visitor_id], unique: true
    add_column :documents, :kudos_count, :integer, default: 0, null: false
  end
end
