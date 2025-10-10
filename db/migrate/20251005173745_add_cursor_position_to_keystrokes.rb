# frozen_string_literal: true

class AddCursorPositionToKeystrokes < ActiveRecord::Migration[8.0]
  def change
    add_column :keystrokes, :cursor_position, :integer
  end
end
