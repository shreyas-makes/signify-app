# frozen_string_literal: true

class RecalculateDocumentStatistics < ActiveRecord::Migration[8.0]
  def up
    Document.find_each do |document|
      # Recalculate word count
      word_count = if document.content.present?
        document.content.strip.split(/\s+/).length
      else
        0
      end
      
      # Recalculate reading time (200 words per minute)
      reading_time_minutes = (word_count / 200.0).ceil
      
      # Recalculate keystroke count
      keystroke_count = document.keystrokes.count
      
      # Update without triggering callbacks
      document.update_columns(
        word_count: word_count,
        reading_time_minutes: reading_time_minutes,
        keystroke_count: keystroke_count
      )
    end
  end
  
  def down
    # No rollback needed
  end
end
