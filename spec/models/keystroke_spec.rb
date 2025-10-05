# frozen_string_literal: true

require "rails_helper"

RSpec.describe Keystroke, type: :model do
  describe "associations" do
    it "belongs to document" do
      keystroke = create(:keystroke)
      expect(keystroke.document).to be_present
    end
  end

  describe "validations" do
    let(:keystroke) { build(:keystroke) }

    it "validates presence of event_type" do
      keystroke.event_type = nil
      expect(keystroke).not_to be_valid
      expect(keystroke.errors[:event_type]).to include("can't be blank")
    end

    it "validates presence of key_code" do
      keystroke.key_code = nil
      expect(keystroke).not_to be_valid
      expect(keystroke.errors[:key_code]).to include("can't be blank")
    end

    it "validates presence of timestamp" do
      keystroke.timestamp = nil
      expect(keystroke).not_to be_valid
      expect(keystroke.errors[:timestamp]).to include("can't be blank")
    end

    it "validates presence of sequence_number" do
      keystroke.sequence_number = nil
      expect(keystroke).not_to be_valid
      expect(keystroke.errors[:sequence_number]).to include("can't be blank")
    end

    it "validates uniqueness of sequence_number scoped to document" do
      document = create(:document)
      create(:keystroke, document: document, sequence_number: 1)
      duplicate_keystroke = build(:keystroke, document: document, sequence_number: 1)
      expect(duplicate_keystroke).not_to be_valid
      expect(duplicate_keystroke.errors[:sequence_number]).to include("has already been taken")
    end
  end

  describe "enums" do
    it "defines event_type enum with correct values" do
      expect(Keystroke.event_types).to eq({"keydown" => 0, "keyup" => 1})
    end

    it "allows setting event_type to keydown" do
      keystroke = build(:keystroke, event_type: :keydown)
      expect(keystroke.event_type).to eq("keydown")
      expect(keystroke).to be_keydown
    end

    it "allows setting event_type to keyup" do
      keystroke = build(:keystroke, event_type: :keyup)
      expect(keystroke.event_type).to eq("keyup")
      expect(keystroke).to be_keyup
    end
  end

  describe "scopes" do
    let(:document) { create(:document) }
    let!(:keystroke1) { create(:keystroke, document: document, sequence_number: 2) }
    let!(:keystroke2) { create(:keystroke, document: document, sequence_number: 1) }
    let!(:keystroke3) { create(:keystroke, sequence_number: 1) }

    describe ".ordered" do
      it "returns keystrokes ordered by sequence_number" do
        expect(Keystroke.ordered.to_a).to eq([keystroke2, keystroke3, keystroke1])
      end
    end

    describe ".for_document" do
      it "returns keystrokes for specific document" do
        expect(Keystroke.for_document(document)).to contain_exactly(keystroke1, keystroke2)
      end
    end
  end

  describe "sequence number uniqueness" do
    let(:document) { create(:document) }

    it "allows same sequence number for different documents" do
      create(:keystroke, document: document, sequence_number: 1)
      other_document = create(:document)
      keystroke = build(:keystroke, document: other_document, sequence_number: 1)

      expect(keystroke).to be_valid
    end

    it "prevents duplicate sequence numbers within same document" do
      create(:keystroke, document: document, sequence_number: 1)
      duplicate_keystroke = build(:keystroke, document: document, sequence_number: 1)

      expect(duplicate_keystroke).not_to be_valid
      expect(duplicate_keystroke.errors[:sequence_number]).to include("has already been taken")
    end
  end

  describe "event types" do
    let(:keystroke) { create(:keystroke) }

    it "can be keydown" do
      keystroke.update!(event_type: :keydown)
      expect(keystroke).to be_keydown
    end

    it "can be keyup" do
      keystroke.update!(event_type: :keyup)
      expect(keystroke).to be_keyup
    end
  end

  describe "timestamp precision" do
    it "stores timestamp with high precision" do
      time = Time.current
      keystroke = create(:keystroke, timestamp: time)
      expect(keystroke.timestamp.to_f).to eq(time.to_f)
    end
  end
end
