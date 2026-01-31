# frozen_string_literal: true

class AddUsernameToUsers < ActiveRecord::Migration[8.0]
  class MigrationUser < ApplicationRecord
    self.table_name = "users"
  end

  def up
    add_column :users, :username, :string
    add_index :users, :username, unique: true

    MigrationUser.reset_column_information
    MigrationUser.find_each do |user|
      base = user.display_name.presence || user.name.presence || user.email.to_s.split("@").first
      base = "user" if base.blank?
      slug = base.to_s.parameterize
      slug = "user" if slug.blank?

      candidate = slug
      counter = 1
      while MigrationUser.exists?(username: candidate)
        candidate = "#{slug}-#{counter}"
        counter += 1
      end

      user.update_columns(username: candidate)
    end

    change_column_null :users, :username, false
  end

  def down
    remove_index :users, :username
    remove_column :users, :username
  end
end
