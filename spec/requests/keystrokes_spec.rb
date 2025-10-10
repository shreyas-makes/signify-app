# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Keystroke Capture", type: :request do
  let(:user) { User.create!(name: "Test User", email: "test@example.com", password: "secure_password", display_name: "Test User") }
  let(:document) { user.documents.create!(title: "Test Document", content: "Initial content", status: :draft) }
  
  before do
    sign_in_as(user)
  end
  
  describe "PATCH /documents/:id with keystroke data" do
    it "saves keystroke data successfully" do
      keystroke_data = [
        {
          event_type: "keydown",
          key_code: 72,
          character: "H",
          timestamp: 0,
          sequence_number: 0,
          cursor_position: 0
        },
        {
          event_type: "keyup",
          key_code: 72,
          character: "H",
          timestamp: 100,
          sequence_number: 1,
          cursor_position: 0
        },
        {
          event_type: "keydown", 
          key_code: 69,
          character: "e",
          timestamp: 200,
          sequence_number: 2,
          cursor_position: 1
        }
      ]
      
      expect {
        patch document_path(document), 
          params: {
            document: { 
              title: "Updated Title",
              content: "Updated content"
            },
            keystrokes: keystroke_data
          }.to_json,
          headers: { 
            "X-Requested-With" => "XMLHttpRequest",
            "Content-Type" => "application/json"
          }
      }.to change { document.keystrokes.count }.by(3)
      
      expect(response).to have_http_status(:ok)
      
      # Verify keystroke data was saved correctly
      keystrokes = document.keystrokes.ordered
      expect(keystrokes.count).to eq(3)
      
      first_keystroke = keystrokes.first
      expect(first_keystroke.event_type).to eq("keydown")
      expect(first_keystroke.key_code).to eq("72")
      expect(first_keystroke.character).to eq("H")
      expect(first_keystroke.sequence_number).to eq(0)
      expect(first_keystroke.cursor_position).to eq(0)
    end
    
    it "prevents duplicate keystrokes with same sequence number" do
      # Create initial keystroke
      document.keystrokes.create!(
        event_type: :keydown,
        key_code: "72",
        character: "H",
        timestamp: Time.current,
        sequence_number: 0,
        cursor_position: 0
      )
      
      keystroke_data = [
        {
          event_type: "keydown",
          key_code: 72,
          character: "H", 
          timestamp: 0,
          sequence_number: 0, # Same sequence number
          cursor_position: 0
        }
      ]
      
      expect {
        patch document_path(document),
          params: {
            document: { content: "test" },
            keystrokes: keystroke_data
          }.to_json,
          headers: { 
            "X-Requested-With" => "XMLHttpRequest",
            "Content-Type" => "application/json"
          }
      }.not_to change { document.keystrokes.count }
    end
    
    it "handles empty keystroke data gracefully" do
      expect {
        patch document_path(document),
          params: {
            document: { content: "test" },
            keystrokes: []
          }.to_json,
          headers: { 
            "X-Requested-With" => "XMLHttpRequest",
            "Content-Type" => "application/json"
          }
      }.not_to change { document.keystrokes.count }
      
      expect(response).to have_http_status(:ok)
    end
  end
end