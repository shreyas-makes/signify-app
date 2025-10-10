# frozen_string_literal: true

require 'rails_helper'

RSpec.describe KeystrokeVerificationService do
  let(:user) { create(:user) }
  let(:document) { create(:document, :published, user: user, content: 'Hello world! This is a test document with some content.') }
  let(:service) { described_class.new(document) }

  describe '#verify' do
    context 'with natural keystroke data' do
      let!(:keystrokes) { create_natural_keystroke_sequence(document, 50) }

      it 'returns comprehensive verification report' do
        result = service.verify

        expect(result).to have_key(:document_info)
        expect(result).to have_key(:data_integrity)
        expect(result).to have_key(:authenticity_analysis)
        expect(result).to have_key(:statistical_analysis)
        expect(result).to have_key(:verification_summary)
        expect(result).to have_key(:generated_at)
      end

      it 'includes correct document information' do
        result = service.verify
        doc_info = result[:document_info]

        expect(doc_info[:title]).to eq(document.title)
        expect(doc_info[:public_slug]).to eq(document.public_slug)
        expect(doc_info[:keystroke_count]).to eq(50)
        expect(doc_info[:author]).to eq(user.display_name)
      end

      it 'performs data integrity checks' do
        result = service.verify
        integrity = result[:data_integrity]

        expect(integrity[:sequence_integrity][:valid]).to be true
        expect(integrity[:temporal_consistency][:valid]).to be true
        expect(integrity[:duplicate_detection][:has_duplicates]).to be false
        expect(integrity[:data_completeness][:within_expected_range]).to be true
      end

      it 'detects natural typing patterns' do
        result = service.verify
        authenticity = result[:authenticity_analysis]

        expect(authenticity[:natural_typing_patterns][:detected]).to be true
        expect(authenticity[:natural_typing_patterns][:confidence]).to be > 70
        expect(authenticity[:timing_variance][:natural_variance]).to be true
      end

      it 'provides statistical analysis' do
        result = service.verify
        stats = result[:statistical_analysis]

        expect(stats[:total_keystrokes]).to eq(50)
        expect(stats[:keydown_events]).to eq(50)
        expect(stats[:typing_speed][:words_per_minute]).to be > 0
        expect(stats[:writing_session][:total_duration_seconds]).to be > 0
      end

      it 'generates positive verification summary' do
        result = service.verify
        summary = result[:verification_summary]

        expect(summary[:overall_status]).to include('verified')
        expect(summary[:confidence_level]).to be > 80
        expect(summary[:key_findings]).to include('Keystroke sequence integrity verified')
        expect(summary[:key_findings]).to include('Natural human typing patterns detected')
      end
    end

    context 'with suspicious keystroke data' do
      let!(:keystrokes) { create_robotic_keystroke_sequence(document, 30) }

      it 'detects unnatural patterns' do
        result = service.verify
        authenticity = result[:authenticity_analysis]

        expect(authenticity[:natural_typing_patterns][:detected]).to be false
        expect(authenticity[:natural_typing_patterns][:confidence]).to be < 50
        expect(authenticity[:timing_variance][:natural_variance]).to be false
      end

      it 'generates negative verification summary' do
        result = service.verify
        summary = result[:verification_summary]

        expect(summary[:overall_status]).to include('unverified')
        expect(summary[:confidence_level]).to be < 50
        expect(summary[:recommendations]).to include('Manual review recommended')
      end
    end

    context 'with data integrity issues' do
      let!(:keystrokes) { create_broken_keystroke_sequence(document) }

      it 'detects sequence gaps' do
        result = service.verify
        integrity = result[:data_integrity]

        expect(integrity[:sequence_integrity][:valid]).to be false
        expect(integrity[:sequence_integrity][:missing_count]).to be > 0
      end

      it 'provides integrity-related recommendations' do
        result = service.verify
        summary = result[:verification_summary]

        expect(summary[:recommendations]).to include('Review keystroke capture system for data loss issues')
      end
    end

    context 'without keystroke data' do
      it 'handles empty keystroke set gracefully' do
        result = service.verify
        summary = result[:verification_summary]

        expect(summary[:overall_status]).to eq('unverified')
        expect(summary[:confidence_level]).to eq(0)
      end
    end
  end

  describe '#verify_authenticity' do
    context 'with good data' do
      let!(:keystrokes) { create_natural_keystroke_sequence(document, 100) }

      it 'returns positive verification result' do
        result = service.verify_authenticity

        expect(result[:verified]).to be true
        expect(result[:confidence_score]).to be > 80
        expect(result[:issues]).to be_empty
        expect(result[:summary]).to include('authentic')
      end
    end

    context 'with problematic data' do
      let!(:keystrokes) { create_robotic_keystroke_sequence(document, 50) }

      it 'returns negative verification result' do
        result = service.verify_authenticity

        expect(result[:verified]).to be false
        expect(result[:confidence_score]).to be < 70
        expect(result[:issues]).not_to be_empty
        expect(result[:summary]).to include('non-human characteristics')
      end
    end
  end

  describe '#export_verification_report' do
    let!(:keystrokes) { create_natural_keystroke_sequence(document, 25) }

    it 'exports verification as valid JSON' do
      json_report = service.export_verification_report

      expect { JSON.parse(json_report) }.not_to raise_error
      
      parsed = JSON.parse(json_report)
      expect(parsed).to have_key('document_info')
      expect(parsed).to have_key('verification_summary')
    end
  end

  describe '#generate_certificate' do
    context 'with verified document' do
      let!(:keystrokes) { create_natural_keystroke_sequence(document, 75) }

      it 'generates verification certificate' do
        certificate = service.generate_certificate

        expect(certificate).to have_key(:certificate_id)
        expect(certificate).to have_key(:document)
        expect(certificate).to have_key(:verification)
        expect(certificate).to have_key(:integrity_markers)
        expect(certificate).to have_key(:issuer)

        expect(certificate[:certificate_id]).to match(/\A[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\z/)
        expect(certificate[:verification][:status]).to eq('VERIFIED')
        expect(certificate[:issuer]).to include('Signify Verification System')
      end

      it 'includes document information in certificate' do
        certificate = service.generate_certificate
        doc_info = certificate[:document]

        expect(doc_info[:title]).to eq(document.title)
        expect(doc_info[:public_slug]).to eq(document.public_slug)
        expect(doc_info[:author]).to eq(user.display_name)
      end

      it 'includes integrity markers' do
        certificate = service.generate_certificate
        markers = certificate[:integrity_markers]

        expect(markers[:has_keystrokes]).to be true
        expect(markers[:sequence_integrity]).to be true
        expect(markers[:temporal_consistency]).to be true
        expect(markers[:natural_patterns]).to be true
      end
    end

    context 'with unverified document' do
      let!(:keystrokes) { create_robotic_keystroke_sequence(document, 30) }

      it 'generates unverified certificate' do
        certificate = service.generate_certificate

        expect(certificate[:verification][:status]).to eq('UNVERIFIED')
        expect(certificate[:verification][:confidence_score]).to be < 70
      end
    end
  end

  describe 'private analysis methods' do
    let!(:keystrokes) { create_natural_keystroke_sequence(document, 40) }

    describe 'data integrity checks' do
      it 'checks sequence integrity correctly' do
        result = service.send(:check_sequence_integrity)
        
        expect(result[:valid]).to be true
        expect(result[:missing_count]).to eq(0)
        expect(result[:integrity_percentage]).to eq(100.0)
      end

      it 'detects missing sequences' do
        # Remove a keystroke to create a gap
        keystrokes[10].destroy
        
        result = service.send(:check_sequence_integrity)
        
        expect(result[:valid]).to be false
        expect(result[:missing_count]).to eq(1)
        expect(result[:missing_sequences]).to include(11) # 0-indexed + 1
      end

      it 'checks temporal consistency' do
        result = service.send(:check_temporal_consistency)
        
        expect(result[:valid]).to be true
        expect(result[:inconsistency_percentage]).to be < 5.0
      end
    end

    describe 'authenticity analysis' do
      it 'detects natural typing patterns' do
        result = service.send(:detect_natural_typing_patterns)
        
        expect(result[:detected]).to be true
        expect(result[:confidence]).to be > 70
        expect(result[:message]).to include('natural human typing')
      end

      it 'analyzes timing variance correctly' do
        result = service.send(:analyze_timing_variance)
        
        expect(result[:natural_variance]).to be true
        expect(result[:coefficient_of_variation]).to be_between(0.2, 2.0)
        expect(result[:variance_assessment]).to include('natural')
      end

      it 'analyzes pause patterns' do
        result = service.send(:analyze_pause_patterns)
        
        expect(result[:natural_pattern]).to be true
        expect(result[:pause_distribution][:short_percentage]).to be > 50
        expect(result[:pause_distribution][:long_percentage]).to be < 30
      end
    end

    describe 'statistical analysis' do
      it 'calculates writing session metrics' do
        timestamps = keystrokes.pluck(:timestamp).map(&:to_f).sort
        result = service.send(:analyze_writing_session, timestamps)
        
        expect(result[:total_duration_seconds]).to be > 0
        expect(result[:session_continuity]).to be_present
        expect(result[:active_writing_time]).to be > 0
      end

      it 'calculates typing speed metrics' do
        key_events = keystrokes.where(event_type: 'keydown')
        timestamps = key_events.pluck(:timestamp).map(&:to_f).sort
        result = service.send(:calculate_typing_metrics, key_events, timestamps)
        
        expect(result[:words_per_minute]).to be > 0
        expect(result[:keystrokes_per_minute]).to be > 0
        expect(result[:estimated_words]).to be > 0
      end
    end
  end

  describe 'confidence scoring' do
    context 'with perfect data' do
      let!(:keystrokes) { create_perfect_keystroke_sequence(document) }

      it 'assigns high confidence score' do
        integrity = service.send(:data_integrity_checks)
        authenticity = service.send(:authenticity_analysis)
        score = service.send(:calculate_confidence_score, integrity, authenticity)

        expect(score).to be >= 90
      end
    end

    context 'with flawed data' do
      let!(:keystrokes) { create_flawed_keystroke_sequence(document) }

      it 'assigns lower confidence score' do
        integrity = service.send(:data_integrity_checks)
        authenticity = service.send(:authenticity_analysis)
        score = service.send(:calculate_confidence_score, integrity, authenticity)

        expect(score).to be < 70
      end
    end
  end

  private

  def create_natural_keystroke_sequence(document, count = 50)
    keystrokes = []
    base_time = 2.hours.ago
    
    count.times do |i|
      # Simulate natural typing with realistic variance
      interval = case rand(100)
      when 0..70  # 70% normal speed
        rand(0.15..0.4)
      when 71..85 # 15% faster
        rand(0.08..0.15)
      when 86..95 # 10% slower (thinking pauses)
        rand(0.4..1.2)
      else        # 5% long pauses
        rand(1.2..3.0)
      end
      
      base_time += interval.seconds
      
      keystrokes << create(:keystroke,
        document: document,
        sequence_number: i + 1,
        timestamp: base_time,
        event_type: 'keydown',
        key_code: rand(65..90),
        character: ('A'..'Z').to_a.sample,
        cursor_position: i
      )
    end
    
    keystrokes
  end

  def create_robotic_keystroke_sequence(document, count = 30)
    keystrokes = []
    base_time = 1.hour.ago
    
    count.times do |i|
      # Unnaturally uniform timing
      base_time += 0.08.seconds # Exactly 80ms - too uniform
      
      keystrokes << create(:keystroke,
        document: document,
        sequence_number: i + 1,
        timestamp: base_time,
        event_type: 'keydown',
        key_code: 65 + (i % 26),
        character: ('A'..'Z').to_a[i % 26],
        cursor_position: i
      )
    end
    
    keystrokes
  end

  def create_broken_keystroke_sequence(document)
    keystrokes = []
    base_time = 1.hour.ago
    
    # Create sequence with gaps and temporal issues
    [1, 2, 3, 5, 6, 8, 10, 11, 15].each_with_index do |seq_num, i|
      interval = rand(0.1..0.5)
      base_time += interval.seconds
      
      # Add some temporal inconsistencies
      if i == 3
        base_time -= 0.2.seconds # Go backwards in time
      end
      
      keystrokes << create(:keystroke,
        document: document,
        sequence_number: seq_num,
        timestamp: base_time,
        event_type: 'keydown',
        key_code: 65 + (i % 26),
        character: ('A'..'Z').to_a[i % 26],
        cursor_position: i
      )
    end
    
    keystrokes
  end

  def create_perfect_keystroke_sequence(document)
    keystrokes = []
    base_time = 1.hour.ago
    
    50.times do |i|
      # Ideal natural variation
      interval = 0.2 + (Math.sin(i * 0.1) * 0.1) + rand(-0.05..0.05)
      base_time += interval.seconds
      
      keystrokes << create(:keystroke,
        document: document,
        sequence_number: i + 1,
        timestamp: base_time,
        event_type: 'keydown',
        key_code: 65 + (i % 26),
        character: ('A'..'Z').to_a[i % 26],
        cursor_position: i
      )
    end
    
    keystrokes
  end

  def create_flawed_keystroke_sequence(document)
    keystrokes = []
    base_time = 1.hour.ago
    
    # Mix of issues: some uniform timing, some gaps, some duplicates
    [1, 2, 3, 3, 5, 6, 6, 8, 10, 11].each_with_index do |seq_num, i|
      if i < 5
        base_time += 0.1.seconds # Too uniform
      else
        base_time += rand(0.05..2.0).seconds # Too variable
      end
      
      keystrokes << create(:keystroke,
        document: document,
        sequence_number: seq_num,
        timestamp: base_time,
        event_type: 'keydown',
        key_code: 65 + (i % 26),
        character: ('A'..'Z').to_a[i % 26],
        cursor_position: i
      )
    end
    
    keystrokes
  end
end