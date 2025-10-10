# frozen_string_literal: true

# Debug helpers for testing keystroke capture
# Usage in Rails console: load 'lib/debug_helpers.rb'

def check_keystrokes(document_id = nil)
  doc = document_id ? Document.find(document_id) : Document.last
  
  puts "=" * 50
  puts "KEYSTROKE CAPTURE DEBUG"
  puts "=" * 50
  puts "Document: #{doc.title}"
  puts "Total keystrokes: #{doc.keystrokes.count}"
  puts "Word count: #{doc.content.present? ? doc.content.split.length : 0}"
  puts
  
  if doc.keystrokes.any?
    puts "First 5 keystrokes:"
    doc.keystrokes.ordered.limit(5).each_with_index do |k, i|
      char_display = k.character&.inspect || 'nil'
      puts "  #{i + 1}. #{k.event_type.upcase}: #{char_display} (key: #{k.key_code}, seq: #{k.sequence_number}, pos: #{k.cursor_position})"
    end
    puts
    
    puts "Last 5 keystrokes:"
    doc.keystrokes.ordered.last(5).each_with_index do |k, i|
      char_display = k.character&.inspect || 'nil'
      puts "  #{i + 1}. #{k.event_type.upcase}: #{char_display} (key: #{k.key_code}, seq: #{k.sequence_number}, pos: #{k.cursor_position})"
    end
    puts
    
    # Check for sequence integrity
    sequences = doc.keystrokes.pluck(:sequence_number).sort
    missing = []
    (0...sequences.last).each { |i| missing << i unless sequences.include?(i) }
    
    if missing.any?
      puts "⚠️  Missing sequence numbers: #{missing}"
    else
      puts "✅ Sequence numbers are continuous"
    end
    
    # Check timestamp ordering
    timestamps = doc.keystrokes.ordered.pluck(:timestamp)
    if timestamps == timestamps.sort
      puts "✅ Timestamps are properly ordered"
    else
      puts "⚠️  Timestamps are out of order"
    end
  else
    puts "No keystrokes found for this document."
    puts "Try typing in the editor and saving to generate keystroke data."
  end
  
  puts "=" * 50
end

def latest_document_keystrokes
  check_keystrokes
end

def user_keystroke_summary(user_id = nil)
  user = user_id ? User.find(user_id) : User.last
  
  puts "=" * 50
  puts "USER KEYSTROKE SUMMARY"
  puts "=" * 50
  puts "User: #{user.display_name} (#{user.email})"
  puts "Documents: #{user.documents.count}"
  
  total_keystrokes = user.documents.joins(:keystrokes).count
  puts "Total keystrokes across all documents: #{total_keystrokes}"
  puts
  
  user.documents.includes(:keystrokes).each do |doc|
    keystroke_count = doc.keystrokes.count
    puts "📄 #{doc.title}: #{keystroke_count} keystrokes"
  end
  puts "=" * 50
end

puts "Debug helpers loaded!"
puts "Commands:"
puts "  check_keystrokes(document_id)  - Check keystroke data for a document"
puts "  latest_document_keystrokes     - Check latest document's keystrokes"
puts "  user_keystroke_summary(user_id) - Summary of user's keystroke data"