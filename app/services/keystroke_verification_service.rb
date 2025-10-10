# frozen_string_literal: true

# Service class for comprehensive keystroke verification and integrity checking
class KeystrokeVerificationService
  attr_reader :document, :keystrokes

  def initialize(document)
    @document = document
    @keystrokes = document.keystrokes.ordered
  end

  # Main verification method that returns a comprehensive report
  def verify
    {
      document_info: document_summary,
      data_integrity: data_integrity_checks,
      authenticity_analysis: authenticity_analysis,
      statistical_analysis: statistical_analysis,
      verification_summary: verification_summary,
      generated_at: Time.current.iso8601
    }
  end

  # Generate a simple pass/fail verification result
  def verify_authenticity
    checks = data_integrity_checks
    analysis = authenticity_analysis
    
    {
      verified: all_checks_pass?(checks, analysis),
      confidence_score: calculate_confidence_score(checks, analysis),
      issues: collect_issues(checks, analysis),
      summary: generate_summary(checks, analysis)
    }
  end

  # Export verification report as JSON
  def export_verification_report
    verify.to_json
  end

  # Generate verification certificate
  def generate_certificate
    verification = verify_authenticity
    
    {
      certificate_id: SecureRandom.uuid,
      document: {
        title: @document.title,
        public_slug: @document.public_slug,
        author: @document.user.display_name,
        published_at: @document.published_at&.iso8601
      },
      verification: {
        status: verification[:verified] ? "VERIFIED" : "UNVERIFIED",
        confidence_score: verification[:confidence_score],
        keystroke_count: @keystrokes.count,
        verification_date: Time.current.iso8601
      },
      integrity_markers: {
        has_keystrokes: @keystrokes.count > 0,
        sequence_integrity: check_sequence_integrity[:valid],
        temporal_consistency: check_temporal_consistency[:valid],
        natural_patterns: detect_natural_typing_patterns[:detected]
      },
      issuer: "Signify Verification System v1.0"
    }
  end

  private

  def document_summary
    {
      id: @document.id,
      title: @document.title,
      public_slug: @document.public_slug,
      word_count: @document.word_count,
      character_count: @document.content&.length || 0,
      keystroke_count: @keystrokes.count,
      author: @document.user.display_name,
      published_at: @document.published_at&.iso8601
    }
  end

  def data_integrity_checks
    {
      sequence_integrity: check_sequence_integrity,
      temporal_consistency: check_temporal_consistency,
      data_completeness: check_data_completeness,
      duplicate_detection: check_for_duplicates
    }
  end

  def authenticity_analysis
    {
      natural_typing_patterns: detect_natural_typing_patterns,
      timing_variance: analyze_timing_variance,
      pause_patterns: analyze_pause_patterns,
      keystroke_rhythm: analyze_keystroke_rhythm
    }
  end

  def statistical_analysis
    return {} if @keystrokes.empty?

    key_events = @keystrokes.where(event_type: 'keydown')
    timestamps = key_events.pluck(:timestamp).map(&:to_f).sort
    
    {
      total_keystrokes: @keystrokes.count,
      keydown_events: key_events.count,
      keyup_events: @keystrokes.where(event_type: 'keyup').count,
      writing_session: analyze_writing_session(timestamps),
      typing_speed: calculate_typing_metrics(key_events, timestamps),
      character_distribution: analyze_character_distribution,
      timing_distribution: analyze_timing_distribution(timestamps)
    }
  end

  def check_sequence_integrity
    sequences = @keystrokes.pluck(:sequence_number).sort
    
    if sequences.empty?
      return { valid: false, message: "No keystroke data found", missing_count: 0 }
    end

    expected = (sequences.first..sequences.last).to_a
    missing = expected - sequences
    
    {
      valid: missing.empty?,
      message: missing.empty? ? "Sequence integrity verified" : "Missing sequence numbers detected",
      missing_sequences: missing,
      missing_count: missing.count,
      total_expected: expected.count,
      integrity_percentage: ((sequences.count.to_f / expected.count) * 100).round(2)
    }
  end

  def check_temporal_consistency
    timestamps = @keystrokes.order(:sequence_number).pluck(:timestamp).map(&:to_f)
    
    if timestamps.count < 2
      return { valid: false, message: "Insufficient data for temporal analysis" }
    end

    inconsistencies = 0
    timestamps.each_cons(2) do |a, b|
      inconsistencies += 1 if b < a
    end

    threshold = timestamps.count * 0.05 # Allow 5% inconsistencies
    valid = inconsistencies <= threshold

    {
      valid: valid,
      message: valid ? "Temporal consistency verified" : "Significant timestamp inconsistencies detected",
      inconsistency_count: inconsistencies,
      inconsistency_percentage: ((inconsistencies.to_f / (timestamps.count - 1)) * 100).round(2),
      threshold_percentage: 5.0
    }
  end

  def check_data_completeness
    content_length = @document.content&.length || 0
    keystroke_count = @keystrokes.count
    
    # Estimate expected keystrokes (rough heuristic)
    # Typical ratio is 2-4 keystrokes per character (including backspaces, navigation)
    min_expected = content_length * 1.5
    max_expected = content_length * 5
    
    ratio = content_length > 0 ? (keystroke_count.to_f / content_length) : 0
    
    {
      content_character_count: content_length,
      keystroke_count: keystroke_count,
      keystroke_to_character_ratio: ratio.round(2),
      within_expected_range: keystroke_count >= min_expected && keystroke_count <= max_expected,
      expected_range: "#{min_expected.to_i}-#{max_expected.to_i}",
      completeness_assessment: assess_completeness(ratio)
    }
  end

  def check_for_duplicates
    sequences = @keystrokes.pluck(:sequence_number)
    duplicates = sequences.group_by(&:itself).select { |_, v| v.count > 1 }
    
    {
      has_duplicates: duplicates.any?,
      duplicate_sequences: duplicates.keys,
      duplicate_count: duplicates.values.sum(&:count) - duplicates.count,
      message: duplicates.any? ? "Duplicate sequence numbers detected" : "No duplicate sequences found"
    }
  end

  def detect_natural_typing_patterns
    key_events = @keystrokes.where(event_type: 'keydown')
    
    if key_events.count < 20
      return { 
        detected: false, 
        message: "Insufficient data for pattern analysis",
        confidence: 0
      }
    end

    timestamps = key_events.pluck(:timestamp).map(&:to_f).sort
    intervals = timestamps.each_cons(2).map { |a, b| b - a }
    
    # Analyze interval distribution for natural patterns
    avg_interval = intervals.sum / intervals.size
    variance = intervals.map { |i| (i - avg_interval) ** 2 }.sum / intervals.size
    std_dev = Math.sqrt(variance)
    
    # Natural typing should have reasonable variance but not be too erratic
    has_variance = std_dev > 0.01 && std_dev < 2.0
    has_reasonable_speed = avg_interval > 0.05 && avg_interval < 5.0
    
    confidence = calculate_naturalness_confidence(intervals, avg_interval, std_dev)
    
    {
      detected: has_variance && has_reasonable_speed,
      confidence: confidence,
      average_interval: avg_interval.round(4),
      standard_deviation: std_dev.round(4),
      message: generate_naturalness_message(has_variance, has_reasonable_speed, confidence)
    }
  end

  def analyze_timing_variance
    key_events = @keystrokes.where(event_type: 'keydown')
    return {} if key_events.count < 10

    timestamps = key_events.pluck(:timestamp).map(&:to_f).sort
    intervals = timestamps.each_cons(2).map { |a, b| b - a }
    
    avg = intervals.sum / intervals.size
    variance = intervals.map { |i| (i - avg) ** 2 }.sum / intervals.size
    std_dev = Math.sqrt(variance)
    
    # Coefficient of variation
    cv = avg > 0 ? (std_dev / avg) : 0
    
    {
      average_interval: avg.round(4),
      standard_deviation: std_dev.round(4),
      coefficient_of_variation: cv.round(4),
      variance_assessment: assess_variance(cv),
      natural_variance: cv > 0.2 && cv < 2.0
    }
  end

  def analyze_pause_patterns
    key_events = @keystrokes.where(event_type: 'keydown')
    return {} if key_events.count < 5

    timestamps = key_events.pluck(:timestamp).map(&:to_f).sort
    intervals = timestamps.each_cons(2).map { |a, b| b - a }
    
    short_pauses = intervals.select { |i| i < 0.5 }
    medium_pauses = intervals.select { |i| i >= 0.5 && i < 2.0 }
    long_pauses = intervals.select { |i| i >= 2.0 }
    
    {
      total_intervals: intervals.count,
      short_pauses: short_pauses.count,
      medium_pauses: medium_pauses.count,
      long_pauses: long_pauses.count,
      longest_pause: intervals.max&.round(2) || 0,
      pause_distribution: {
        short_percentage: (short_pauses.count.to_f / intervals.count * 100).round(1),
        medium_percentage: (medium_pauses.count.to_f / intervals.count * 100).round(1),
        long_percentage: (long_pauses.count.to_f / intervals.count * 100).round(1)
      },
      natural_pattern: assess_pause_naturalness(short_pauses, medium_pauses, long_pauses, intervals)
    }
  end

  def analyze_keystroke_rhythm
    key_events = @keystrokes.where(event_type: 'keydown')
    return {} if key_events.count < 20

    timestamps = key_events.pluck(:timestamp).map(&:to_f).sort
    intervals = timestamps.each_cons(2).map { |a, b| b - a }
    
    # Calculate rhythm metrics
    median = intervals.sort[intervals.count / 2]
    q1 = intervals.sort[intervals.count / 4]
    q3 = intervals.sort[(intervals.count * 3) / 4]
    
    {
      median_interval: median.round(4),
      first_quartile: q1.round(4),
      third_quartile: q3.round(4),
      interquartile_range: (q3 - q1).round(4),
      rhythm_consistency: calculate_rhythm_consistency(intervals),
      tempo_stability: assess_tempo_stability(intervals)
    }
  end

  def analyze_writing_session(timestamps)
    return {} if timestamps.count < 2

    duration = timestamps.last - timestamps.first
    
    # Detect breaks (gaps > 30 seconds)
    intervals = timestamps.each_cons(2).map { |a, b| b - a }
    breaks = intervals.select { |i| i > 30 }
    
    {
      total_duration_seconds: duration.round(2),
      total_duration_formatted: format_duration(duration),
      number_of_breaks: breaks.count,
      longest_break_seconds: breaks.max&.round(2) || 0,
      active_writing_time: (duration - breaks.sum).round(2),
      session_continuity: assess_session_continuity(breaks, duration)
    }
  end

  def calculate_typing_metrics(key_events, timestamps)
    return {} if timestamps.count < 2 || key_events.empty?

    duration_minutes = (timestamps.last - timestamps.first) / 60.0
    return {} if duration_minutes <= 0

    # Estimate words (rough calculation)
    character_keys = key_events.where("key_code NOT IN (?)", [8, 9, 13, 16, 17, 18, 27, 37, 38, 39, 40])
    estimated_words = character_keys.count / 5.0
    
    {
      estimated_words: estimated_words.round(1),
      words_per_minute: (estimated_words / duration_minutes).round(1),
      keystrokes_per_minute: (key_events.count / duration_minutes).round(1),
      characters_per_minute: (character_keys.count / duration_minutes).round(1)
    }
  end

  def analyze_character_distribution
    characters = @keystrokes.where.not(character: [nil, '']).pluck(:character)
    return {} if characters.empty?

    distribution = characters.group_by(&:itself).transform_values(&:count)
    sorted_chars = distribution.sort_by { |_, count| -count }
    
    {
      unique_characters: distribution.keys.count,
      most_frequent: sorted_chars.first(5).to_h,
      character_variety: assess_character_variety(distribution),
      total_character_keystrokes: characters.count
    }
  end

  def analyze_timing_distribution(timestamps)
    return {} if timestamps.count < 5

    intervals = timestamps.each_cons(2).map { |a, b| b - a }
    
    # Create timing buckets
    very_fast = intervals.select { |i| i < 0.1 }    # < 100ms
    fast = intervals.select { |i| i >= 0.1 && i < 0.3 }  # 100-300ms
    normal = intervals.select { |i| i >= 0.3 && i < 1.0 } # 300ms-1s
    slow = intervals.select { |i| i >= 1.0 && i < 3.0 }   # 1-3s
    very_slow = intervals.select { |i| i >= 3.0 }         # > 3s
    
    {
      very_fast_count: very_fast.count,
      fast_count: fast.count,
      normal_count: normal.count,
      slow_count: slow.count,
      very_slow_count: very_slow.count,
      distribution_percentages: {
        very_fast: (very_fast.count.to_f / intervals.count * 100).round(1),
        fast: (fast.count.to_f / intervals.count * 100).round(1),
        normal: (normal.count.to_f / intervals.count * 100).round(1),
        slow: (slow.count.to_f / intervals.count * 100).round(1),
        very_slow: (very_slow.count.to_f / intervals.count * 100).round(1)
      }
    }
  end

  def verification_summary
    integrity = data_integrity_checks
    authenticity = authenticity_analysis
    
    {
      overall_status: determine_overall_status(integrity, authenticity),
      confidence_level: calculate_confidence_score(integrity, authenticity),
      key_findings: generate_key_findings(integrity, authenticity),
      recommendations: generate_recommendations(integrity, authenticity)
    }
  end

  # Helper methods for assessments and calculations

  def all_checks_pass?(integrity, authenticity)
    integrity[:sequence_integrity][:valid] &&
    integrity[:temporal_consistency][:valid] &&
    !integrity[:duplicate_detection][:has_duplicates] &&
    authenticity[:natural_typing_patterns][:detected]
  end

  def calculate_confidence_score(integrity, authenticity)
    score = 0
    
    # Integrity checks (40% of total score)
    score += 10 if integrity[:sequence_integrity][:valid]
    score += 10 if integrity[:temporal_consistency][:valid]
    score += 10 if !integrity[:duplicate_detection][:has_duplicates]
    score += 10 if integrity[:data_completeness][:within_expected_range]
    
    # Authenticity checks (60% of total score)
    score += 20 if authenticity[:natural_typing_patterns][:detected]
    score += 20 if authenticity[:timing_variance][:natural_variance]
    score += 20 if authenticity[:pause_patterns][:natural_pattern]
    
    score
  end

  def collect_issues(integrity, authenticity)
    issues = []
    
    issues << "Sequence integrity compromised" unless integrity[:sequence_integrity][:valid]
    issues << "Temporal inconsistencies detected" unless integrity[:temporal_consistency][:valid]
    issues << "Duplicate keystrokes found" if integrity[:duplicate_detection][:has_duplicates]
    issues << "Unnatural typing patterns detected" unless authenticity[:natural_typing_patterns][:detected]
    issues << "Suspicious timing variance" unless authenticity[:timing_variance][:natural_variance]
    
    issues
  end

  def generate_summary(integrity, authenticity)
    if all_checks_pass?(integrity, authenticity)
      "Keystroke data verified as authentic with high confidence"
    elsif integrity.values.all? { |check| check[:valid] != false }
      "Data integrity verified, authenticity analysis shows mixed results"
    else
      "Significant issues detected in keystroke data verification"
    end
  end

  def assess_completeness(ratio)
    case ratio
    when 0..1.0
      "Very low - insufficient keystroke data"
    when 1.0..2.0
      "Low - minimal keystroke data"
    when 2.0..4.0
      "Normal - expected keystroke data"
    when 4.0..6.0
      "High - above average keystroke data"
    else
      "Very high - excessive keystroke data"
    end
  end

  def calculate_naturalness_confidence(intervals, avg, std_dev)
    # Multiple factors contribute to naturalness confidence
    variance_score = std_dev > 0.01 && std_dev < 2.0 ? 25 : 0
    speed_score = avg > 0.05 && avg < 5.0 ? 25 : 0
    distribution_score = assess_interval_distribution(intervals)
    consistency_score = assess_interval_consistency(intervals)
    
    [variance_score + speed_score + distribution_score + consistency_score, 100].min
  end

  def assess_interval_distribution(intervals)
    # Check for reasonable distribution of intervals
    short = intervals.select { |i| i < 0.2 }.count
    medium = intervals.select { |i| i >= 0.2 && i < 1.0 }.count
    long = intervals.select { |i| i >= 1.0 }.count
    
    total = intervals.count
    return 0 if total == 0
    
    # Natural typing should have a mix of intervals
    short_pct = short.to_f / total
    medium_pct = medium.to_f / total
    long_pct = long.to_f / total
    
    # Ideal distribution: mostly medium, some short, fewer long
    if medium_pct > 0.4 && short_pct > 0.1 && long_pct < 0.3
      25
    elsif medium_pct > 0.3
      15
    else
      5
    end
  end

  def assess_interval_consistency(intervals)
    # Check for reasonable consistency without being too uniform
    return 0 if intervals.count < 10
    
    # Group similar intervals
    buckets = {}
    intervals.each do |interval|
      bucket = (interval * 10).round / 10.0  # Round to nearest 0.1
      buckets[bucket] = (buckets[bucket] || 0) + 1
    end
    
    # Too uniform suggests automation
    max_bucket_size = buckets.values.max
    uniformity = max_bucket_size.to_f / intervals.count
    
    if uniformity < 0.3  # No single interval dominates
      25
    elsif uniformity < 0.5
      15
    else
      5
    end
  end

  def generate_naturalness_message(has_variance, has_reasonable_speed, confidence)
    if has_variance && has_reasonable_speed && confidence > 70
      "Strong indicators of natural human typing patterns"
    elsif has_variance && has_reasonable_speed
      "Moderate indicators of natural typing patterns"
    elsif !has_variance
      "Typing patterns show insufficient variance for natural typing"
    elsif !has_reasonable_speed
      "Typing speed outside normal human range"
    else
      "Typing patterns show characteristics inconsistent with natural human typing"
    end
  end

  def assess_variance(cv)
    case cv
    when 0..0.1
      "Very low variance - potentially automated"
    when 0.1..0.5
      "Low variance - very consistent typing"
    when 0.5..1.5
      "Normal variance - natural typing patterns"
    when 1.5..3.0
      "High variance - irregular typing patterns"
    else
      "Very high variance - erratic typing patterns"
    end
  end

  def assess_pause_naturalness(short, medium, long, all_intervals)
    total = all_intervals.count
    return false if total < 5
    
    short_pct = short.count.to_f / total
    medium_pct = medium.count.to_f / total
    long_pct = long.count.to_f / total
    
    # Natural pattern: mostly short pauses, some medium, occasional long
    short_pct > 0.5 && medium_pct > 0.1 && long_pct < 0.3
  end

  def calculate_rhythm_consistency(intervals)
    return 0 if intervals.count < 5
    
    # Calculate how consistent the rhythm is
    median = intervals.sort[intervals.count / 2]
    deviations = intervals.map { |i| (i - median).abs }
    avg_deviation = deviations.sum / deviations.count
    
    consistency_ratio = median > 0 ? (avg_deviation / median) : 1
    
    # Lower ratio indicates more consistent rhythm
    [(1 - consistency_ratio) * 100, 0].max.round(2)
  end

  def assess_tempo_stability(intervals)
    return "insufficient_data" if intervals.count < 20
    
    # Analyze tempo over time by comparing intervals in chunks
    chunk_size = intervals.count / 4
    chunks = intervals.each_slice(chunk_size).to_a[0, 4]
    
    chunk_averages = chunks.map { |chunk| chunk.sum / chunk.size }
    tempo_variance = chunk_averages.map { |avg| (avg - chunk_averages.sum / chunk_averages.size) ** 2 }.sum / chunk_averages.size
    
    case Math.sqrt(tempo_variance)
    when 0..0.1
      "very_stable"
    when 0.1..0.3
      "stable"
    when 0.3..0.6
      "moderate"
    when 0.6..1.0
      "variable"
    else
      "highly_variable"
    end
  end

  def format_duration(seconds)
    hours = seconds / 3600
    minutes = (seconds % 3600) / 60
    secs = seconds % 60
    
    if hours > 0
      "#{hours.to_i}h #{minutes.to_i}m #{secs.to_i}s"
    elsif minutes > 0
      "#{minutes.to_i}m #{secs.to_i}s"
    else
      "#{secs.to_i}s"
    end
  end

  def assess_session_continuity(breaks, total_duration)
    return "continuous" if breaks.empty?
    
    break_time = breaks.sum
    break_percentage = (break_time / total_duration) * 100
    
    case break_percentage
    when 0..10
      "highly_continuous"
    when 10..25
      "mostly_continuous"
    when 25..50
      "moderately_fragmented"
    when 50..75
      "fragmented"
    else
      "highly_fragmented"
    end
  end

  def assess_character_variety(distribution)
    unique_count = distribution.keys.count
    total_chars = distribution.values.sum
    
    return "insufficient_data" if total_chars < 20
    
    case unique_count
    when 0..5
      "very_limited"
    when 6..15
      "limited"
    when 16..30
      "moderate"
    when 31..50
      "good"
    else
      "excellent"
    end
  end

  def determine_overall_status(integrity, authenticity)
    integrity_score = calculate_integrity_score(integrity)
    authenticity_score = calculate_authenticity_score(authenticity)
    
    overall_score = (integrity_score + authenticity_score) / 2
    
    case overall_score
    when 90..100
      "verified_high_confidence"
    when 70..89
      "verified_medium_confidence"
    when 50..69
      "verified_low_confidence"
    when 30..49
      "questionable"
    else
      "unverified"
    end
  end

  def calculate_integrity_score(integrity)
    score = 0
    score += 25 if integrity[:sequence_integrity][:valid]
    score += 25 if integrity[:temporal_consistency][:valid]
    score += 25 if !integrity[:duplicate_detection][:has_duplicates]
    score += 25 if integrity[:data_completeness][:within_expected_range]
    score
  end

  def calculate_authenticity_score(authenticity)
    score = 0
    score += 25 if authenticity[:natural_typing_patterns][:detected]
    score += 25 if authenticity[:timing_variance][:natural_variance]
    score += 25 if authenticity[:pause_patterns][:natural_pattern]
    score += 25 # Base score for having analyzable data
    score
  end

  def generate_key_findings(integrity, authenticity)
    findings = []
    
    if integrity[:sequence_integrity][:valid]
      findings << "Keystroke sequence integrity verified"
    else
      findings << "Keystroke sequence gaps detected (#{integrity[:sequence_integrity][:missing_count]} missing)"
    end
    
    if authenticity[:natural_typing_patterns][:detected]
      findings << "Natural human typing patterns detected"
    else
      findings << "Typing patterns show non-human characteristics"
    end
    
    timing = authenticity[:timing_variance]
    if timing[:natural_variance]
      findings << "Timing variance consistent with human typing"
    else
      findings << "Timing variance outside normal human range"
    end
    
    findings
  end

  def generate_recommendations(integrity, authenticity)
    recommendations = []
    
    unless integrity[:sequence_integrity][:valid]
      recommendations << "Review keystroke capture system for data loss issues"
    end
    
    unless integrity[:temporal_consistency][:valid]
      recommendations << "Investigate timestamp synchronization issues"
    end
    
    if integrity[:duplicate_detection][:has_duplicates]
      recommendations << "Check for duplicate keystroke recording bugs"
    end
    
    unless authenticity[:natural_typing_patterns][:detected]
      recommendations << "Manual review recommended - patterns may indicate automation"
    end
    
    recommendations << "Consider additional verification methods for critical documents" if recommendations.any?
    
    recommendations
  end
end