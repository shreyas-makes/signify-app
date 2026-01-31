# frozen_string_literal: true

class CreateExtensionAuthCodes < ActiveRecord::Migration[8.0]
  def change
    create_table :extension_auth_codes do |t|
      t.references :user, null: false, foreign_key: true
      t.string :code, null: false
      t.string :state
      t.string :redirect_uri, null: false
      t.datetime :expires_at, null: false
      t.datetime :redeemed_at
      t.timestamps
    end

    add_index :extension_auth_codes, :code, unique: true
    add_index :extension_auth_codes, :expires_at
  end
end
