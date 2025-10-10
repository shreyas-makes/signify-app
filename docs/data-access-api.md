# Signify Data Access & Verification API

This document provides comprehensive documentation for accessing and verifying keystroke data from Signify posts.

## Table of Contents

- [API Overview](#api-overview)
- [Authentication & Rate Limiting](#authentication--rate-limiting)
- [Data Access Endpoints](#data-access-endpoints)
- [Verification Endpoints](#verification-endpoints)
- [Data Formats](#data-formats)
- [Verification Tools](#verification-tools)
- [Example Scripts](#example-scripts)
- [Technical Specifications](#technical-specifications)

## API Overview

Signify provides two main categories of data access:

1. **Raw Data Access**: Download complete keystroke datasets in JSON or CSV format
2. **Verification API**: Access processed verification analysis and integrity checks

### Base URLs

- Production: `https://your-domain.com/api/v1/`
- Development: `http://localhost:3000/api/v1/`

### Response Format

All API responses return JSON with appropriate HTTP status codes:
- `200 OK`: Successful request
- `404 Not Found`: Post not found
- `429 Too Many Requests`: Rate limit exceeded
- `400 Bad Request`: Invalid parameters

## Authentication & Rate Limiting

### Public Access
All verification and data access endpoints are **publicly accessible** without authentication. This ensures transparency and enables third-party verification.

### Rate Limiting
- **Data Access**: 10 requests per minute per IP address
- **Verification**: 20 requests per minute per IP address
- **User Downloads**: No rate limit (authenticated users accessing own data)

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1640995200
```

### CORS Support
All endpoints include CORS headers for cross-origin requests:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET
Access-Control-Allow-Headers: Content-Type
```

## Data Access Endpoints

### Get Raw Keystroke Data

**Endpoint**: `GET /api/v1/posts/{public_slug}/data`

**Parameters**:
- `public_slug` (required): The public slug of the published post
- `format` (optional): Response format - `json` (default) or `csv`

**Example Requests**:
```bash
# Get JSON data
curl "https://your-domain.com/api/v1/posts/my-first-post/data"

# Get CSV data
curl "https://your-domain.com/api/v1/posts/my-first-post/data?format=csv"
```

**JSON Response Structure**:
```json
{
  "document": {
    "id": 123,
    "title": "My First Post",
    "public_slug": "my-first-post",
    "published_at": "2024-01-15T10:30:00Z",
    "word_count": 245,
    "reading_time_minutes": 2,
    "keystroke_count": 1205,
    "character_count": 1456,
    "author": {
      "display_name": "John Doe"
    }
  },
  "keystrokes": [
    {
      "sequence_number": 1,
      "event_type": "keydown",
      "key_code": 72,
      "character": "H",
      "timestamp": 1642248600.123,
      "cursor_position": 0,
      "metadata": {
        "created_at": "2024-01-15T10:30:00.123Z"
      }
    }
  ],
  "data_format": {
    "version": "1.0",
    "timestamp_unit": "seconds_since_epoch",
    "total_keystrokes": 1205,
    "exported_at": "2024-01-15T15:45:30Z"
  }
}
```

**CSV Response**:
The CSV format includes headers and contains the following columns:
- `sequence_number`: Order of keystroke in the document
- `event_type`: "keydown" or "keyup"
- `key_code`: Numeric JavaScript key code
- `character`: The actual character typed (if applicable)
- `timestamp`: Unix timestamp in seconds with millisecond precision
- `cursor_position`: Position in the document
- `created_at`: ISO 8601 timestamp when keystroke was recorded

## Verification Endpoints

### Get Verification Analysis

**Endpoint**: `GET /api/v1/posts/{public_slug}/verify`

**Parameters**:
- `public_slug` (required): The public slug of the published post

**Example Request**:
```bash
curl "https://your-domain.com/api/v1/posts/my-first-post/verify"
```

**Response Structure**:
```json
{
  "document_info": {
    "title": "My First Post",
    "public_slug": "my-first-post",
    "word_count": 245,
    "keystroke_count": 1205,
    "author": "John Doe"
  },
  "data_integrity": {
    "sequence_integrity": {
      "valid": true,
      "message": "Sequence integrity verified",
      "missing_count": 0,
      "integrity_percentage": 100.0
    },
    "temporal_consistency": {
      "valid": true,
      "message": "Temporal consistency verified",
      "inconsistency_percentage": 0.5
    },
    "data_completeness": {
      "keystroke_to_character_ratio": 2.14,
      "within_expected_range": true,
      "completeness_assessment": "Normal - expected keystroke data"
    }
  },
  "authenticity_analysis": {
    "natural_typing_patterns": {
      "detected": true,
      "confidence": 85,
      "message": "Strong indicators of natural human typing patterns"
    },
    "timing_variance": {
      "natural_variance": true,
      "coefficient_of_variation": 0.45,
      "variance_assessment": "Normal variance - natural typing patterns"
    },
    "pause_patterns": {
      "natural_pattern": true,
      "pause_distribution": {
        "short_percentage": 72.3,
        "medium_percentage": 23.1,
        "long_percentage": 4.6
      }
    }
  },
  "statistical_analysis": {
    "writing_session": {
      "total_duration_seconds": 1847.5,
      "number_of_breaks": 3,
      "session_continuity": "mostly_continuous"
    },
    "typing_speed": {
      "words_per_minute": 42.5,
      "keystrokes_per_minute": 185.2
    }
  },
  "verification_summary": {
    "overall_status": "verified_high_confidence",
    "confidence_level": 88,
    "key_findings": [
      "Keystroke sequence integrity verified",
      "Natural human typing patterns detected",
      "Timing variance consistent with human typing"
    ]
  },
  "generated_at": "2024-01-15T15:45:30Z"
}
```

## Data Formats

### Keystroke Data Structure

Each keystroke record contains the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `sequence_number` | Integer | Sequential order of keystroke (starts at 1) |
| `event_type` | String | "keydown" or "keyup" |
| `key_code` | Integer | JavaScript KeyboardEvent.keyCode |
| `character` | String | Actual character typed (null for non-character keys) |
| `timestamp` | Float | Unix timestamp with millisecond precision |
| `cursor_position` | Integer | Position in document when keystroke occurred |

### Key Code Reference

Common key codes used in the data:
- **Letters**: A=65, B=66, ..., Z=90
- **Numbers**: 0=48, 1=49, ..., 9=57
- **Special Keys**: Space=32, Enter=13, Backspace=8, Tab=9
- **Navigation**: Left=37, Up=38, Right=39, Down=40
- **Modifiers**: Shift=16, Ctrl=17, Alt=18

### Timestamp Format

Timestamps are Unix timestamps (seconds since epoch) with millisecond precision:
```
1642248600.123 = January 15, 2024, 10:30:00.123 UTC
```

## Verification Tools

### Built-in Verification Checks

The verification system performs comprehensive analysis:

#### Data Integrity Checks
1. **Sequence Integrity**: Verifies all keystroke sequence numbers are present
2. **Temporal Consistency**: Ensures timestamps follow logical order
3. **Duplicate Detection**: Identifies duplicate sequence numbers
4. **Data Completeness**: Validates keystroke-to-character ratios

#### Authenticity Analysis
1. **Natural Typing Patterns**: Detects human typing characteristics
2. **Timing Variance**: Analyzes intervals between keystrokes
3. **Pause Patterns**: Examines natural pauses in typing rhythm
4. **Statistical Analysis**: Comprehensive typing behavior analysis

#### Confidence Scoring
Verification confidence is calculated based on multiple factors:
- **90-100%**: Verified with high confidence
- **70-89%**: Verified with medium confidence
- **50-69%**: Verified with low confidence
- **30-49%**: Questionable authenticity
- **0-29%**: Unverified

## Example Scripts

### Python Data Analysis Script

```python
import requests
import pandas as pd
import json
from datetime import datetime

def fetch_keystroke_data(public_slug, format='json'):
    """Fetch keystroke data for analysis"""
    url = f"https://your-domain.com/api/v1/posts/{public_slug}/data"
    params = {'format': format}
    
    response = requests.get(url, params=params)
    response.raise_for_status()
    
    if format == 'csv':
        return pd.read_csv(StringIO(response.text))
    else:
        return response.json()

def verify_document(public_slug):
    """Get verification analysis"""
    url = f"https://your-domain.com/api/v1/posts/{public_slug}/verify"
    
    response = requests.get(url)
    response.raise_for_status()
    
    return response.json()

def analyze_typing_speed(keystroke_data):
    """Analyze typing speed from keystroke data"""
    df = pd.DataFrame(keystroke_data['keystrokes'])
    
    # Filter keydown events only
    keydown_events = df[df['event_type'] == 'keydown']
    
    if len(keydown_events) < 2:
        return None
    
    # Calculate intervals
    keydown_events = keydown_events.sort_values('sequence_number')
    intervals = keydown_events['timestamp'].diff().dropna()
    
    return {
        'mean_interval': intervals.mean(),
        'median_interval': intervals.median(),
        'std_deviation': intervals.std(),
        'total_keystrokes': len(keydown_events),
        'estimated_wpm': estimate_wpm(keydown_events, intervals)
    }

def estimate_wpm(keydown_events, intervals):
    """Estimate words per minute"""
    if len(intervals) == 0:
        return 0
    
    total_time_minutes = intervals.sum() / 60
    character_keys = keydown_events[keydown_events['character'].notna()]
    estimated_words = len(character_keys) / 5  # Average 5 characters per word
    
    return estimated_words / total_time_minutes if total_time_minutes > 0 else 0

# Example usage
data = fetch_keystroke_data('my-first-post')
verification = verify_document('my-first-post')
typing_analysis = analyze_typing_speed(data)

print(f"Verification Status: {verification['verification_summary']['overall_status']}")
print(f"Confidence Level: {verification['verification_summary']['confidence_level']}%")
print(f"Estimated WPM: {typing_analysis['estimated_wpm']:.1f}")
```

### JavaScript Verification Script

```javascript
class SignifyVerifier {
  constructor(baseUrl = 'https://your-domain.com/api/v1') {
    this.baseUrl = baseUrl;
  }

  async fetchData(publicSlug, format = 'json') {
    const url = `${this.baseUrl}/posts/${publicSlug}/data?format=${format}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return format === 'csv' ? await response.text() : await response.json();
  }

  async verify(publicSlug) {
    const url = `${this.baseUrl}/posts/${publicSlug}/verify`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  }

  analyzeTypingRhythm(keystrokes) {
    const keydownEvents = keystrokes
      .filter(k => k.event_type === 'keydown')
      .sort((a, b) => a.sequence_number - b.sequence_number);
    
    if (keydownEvents.length < 10) {
      return { error: 'Insufficient data for rhythm analysis' };
    }

    const intervals = [];
    for (let i = 1; i < keydownEvents.length; i++) {
      intervals.push(keydownEvents[i].timestamp - keydownEvents[i-1].timestamp);
    }

    const mean = intervals.reduce((a, b) => a + b) / intervals.length;
    const variance = intervals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);

    return {
      meanInterval: mean,
      standardDeviation: stdDev,
      coefficientOfVariation: stdDev / mean,
      isNaturalRhythm: stdDev > 0.01 && stdDev < 2.0
    };
  }

  detectAnomalies(keystrokes) {
    const anomalies = [];
    
    // Check for suspiciously uniform timing
    const intervals = this.getIntervals(keystrokes);
    const uniformityCheck = this.checkUniformity(intervals);
    
    if (uniformityCheck.tooUniform) {
      anomalies.push({
        type: 'uniform_timing',
        severity: 'high',
        description: 'Typing intervals are suspiciously uniform'
      });
    }

    // Check for impossible speeds
    const fastIntervals = intervals.filter(i => i < 0.05); // < 50ms
    if (fastIntervals.length / intervals.length > 0.1) {
      anomalies.push({
        type: 'impossible_speed',
        severity: 'high',
        description: 'Too many impossibly fast keystrokes detected'
      });
    }

    return anomalies;
  }

  getIntervals(keystrokes) {
    const keydownEvents = keystrokes
      .filter(k => k.event_type === 'keydown')
      .sort((a, b) => a.sequence_number - b.sequence_number);
    
    const intervals = [];
    for (let i = 1; i < keydownEvents.length; i++) {
      intervals.push(keydownEvents[i].timestamp - keydownEvents[i-1].timestamp);
    }
    
    return intervals;
  }

  checkUniformity(intervals) {
    if (intervals.length < 20) return { tooUniform: false };
    
    // Group intervals into buckets and check distribution
    const buckets = {};
    intervals.forEach(interval => {
      const bucket = Math.round(interval * 100) / 100; // Round to nearest 0.01
      buckets[bucket] = (buckets[bucket] || 0) + 1;
    });

    const maxBucketSize = Math.max(...Object.values(buckets));
    const uniformityRatio = maxBucketSize / intervals.length;
    
    return {
      tooUniform: uniformityRatio > 0.3, // More than 30% in same bucket
      uniformityRatio: uniformityRatio
    };
  }
}

// Example usage
const verifier = new SignifyVerifier();

async function analyzePost(publicSlug) {
  try {
    const [data, verification] = await Promise.all([
      verifier.fetchData(publicSlug),
      verifier.verify(publicSlug)
    ]);

    const rhythm = verifier.analyzeTypingRhythm(data.keystrokes);
    const anomalies = verifier.detectAnomalies(data.keystrokes);

    console.log('Verification Status:', verification.verification_summary.overall_status);
    console.log('Confidence Level:', verification.verification_summary.confidence_level + '%');
    console.log('Natural Rhythm:', rhythm.isNaturalRhythm);
    console.log('Anomalies Detected:', anomalies.length);

    return {
      verification,
      rhythm,
      anomalies,
      keystrokeCount: data.keystrokes.length
    };
  } catch (error) {
    console.error('Analysis failed:', error.message);
    return null;
  }
}
```

## Technical Specifications

### Data Retention
- Published documents: Keystroke data retained permanently
- Draft documents: Data retained for 90 days after last edit
- Deleted documents: Data permanently removed within 24 hours

### Performance Characteristics
- Typical response time: < 500ms for verification endpoints
- Large documents (>10,000 keystrokes): May take up to 2 seconds
- CSV downloads: Efficient streaming for large datasets
- Concurrent requests: System handles up to 100 simultaneous requests

### Data Accuracy
- Timestamp precision: Millisecond accuracy (±1ms)
- Sequence integrity: 99.9% accuracy in production
- Character capture: 100% accuracy for supported keyboards
- Browser compatibility: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)

### Security Considerations
- No authentication required for transparency
- Rate limiting prevents abuse
- No sensitive user data exposed in API
- HTTPS enforced in production
- Input validation on all parameters

### API Versioning
- Current version: v1
- Backward compatibility: Maintained for at least 12 months
- Deprecation notice: 6 months advance notice for breaking changes
- Version header: `API-Version: v1` included in responses

### Error Handling

Common error responses:

```json
{
  "error": "Post not found",
  "code": "POST_NOT_FOUND",
  "timestamp": "2024-01-15T15:45:30Z"
}
```

```json
{
  "error": "Rate limit exceeded. Maximum 10 requests per minute.",
  "code": "RATE_LIMIT_EXCEEDED", 
  "retry_after": 60,
  "timestamp": "2024-01-15T15:45:30Z"
}
```

### SDK and Libraries

Official SDKs are planned for:
- Python (signify-python)
- JavaScript/Node.js (signify-js)
- Ruby (signify-ruby)
- Go (signify-go)

Community contributions welcome for other languages.

---

For questions or support, please visit our [GitHub repository](https://github.com/your-org/signify) or contact support@your-domain.com.