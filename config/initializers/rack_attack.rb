# frozen_string_literal: true

class Rack::Attack
  # Enable logging
  Rack::Attack.enabled = ENV.fetch("RACK_ATTACK_ENABLED", Rails.env.production?).to_s == "true"

  # Cache configuration
  Rack::Attack.cache.store = ActiveSupport::Cache::MemoryStore.new

  # Allow localhost in development and test
  Rack::Attack.safelist("allow-localhost") do |req|
    req.ip == "127.0.0.1" || req.ip == "::1" if Rails.env.development? || Rails.env.test?
  end

  # Authentication rate limits
  throttle("logins/email", limit: 5, period: 15.minutes) do |req|
    if req.path == "/sign_in" && req.post?
      req.params.dig("user", "email").to_s.downcase.gsub(/\s+/, "")
    end
  end

  throttle("signups/ip", limit: 3, period: 1.hour) do |req|
    if req.path == "/sign_up" && req.post?
      req.ip
    end
  end

  # Password reset rate limits
  throttle("password-resets/email", limit: 3, period: 1.hour) do |req|
    if req.path == "/password/resets" && req.post?
      req.params.dig("user", "email").to_s.downcase.gsub(/\s+/, "")
    end
  end

  # API rate limits for public endpoints
  throttle("api/ip", limit: 100, period: 1.hour) do |req|
    if req.path.start_with?("/api/")
      req.ip
    end
  end

  # General rate limiting by IP
  throttle("req/ip", limit: 300, period: 5.minutes) do |req|
    req.ip unless req.path.start_with?("/assets/") || req.path.start_with?("/vite/")
  end

  # POST request rate limiting
  throttle("posts/ip", limit: 20, period: 1.minute) do |req|
    if req.post? && !req.path.start_with?("/assets/") && !req.path.start_with?("/vite/")
      req.ip
    end
  end

  # Document creation rate limiting
  throttle("documents/ip", limit: 10, period: 1.hour) do |req|
    if req.path == "/documents" && req.post?
      req.ip
    end
  end

  # Publishing rate limiting
  throttle("publishing/ip", limit: 5, period: 1.hour) do |req|
    if req.path.match?(/\/documents\/\d+\/publish/) && req.patch?
      req.ip
    end
  end

  # Keystroke data rate limiting (higher limit for legitimate usage)
  throttle("keystrokes/ip", limit: 1000, period: 1.hour) do |req|
    if req.path.match?(/\/documents\/\d+/) && req.patch? && req.xhr?
      req.ip
    end
  end

  # Custom response for rate limited requests
  self.throttled_responder = lambda do |_env|
    match_data = _env["rack.attack.match_data"]
    now = match_data[:epoch_time]

    headers = {
      "Content-Type" => "application/json",
      "Retry-After" => match_data[:period].to_s,
      "X-RateLimit-Limit" => match_data[:limit].to_s,
      "X-RateLimit-Remaining" => "0",
      "X-RateLimit-Reset" => (now + match_data[:period]).to_s
    }

    body = {
      error: "Rate limit exceeded",
      message: "Too many requests. Please try again later.",
      retry_after: match_data[:period]
    }

    [429, headers, [body.to_json]]
  end
end

# Log rate limit events
ActiveSupport::Notifications.subscribe("rack.attack") do |name, start, finish, request_id, payload|
  request = payload[:request]
  
  case name
  when "throttle.rack.attack"
    Rails.logger.warn "[Rack::Attack] Rate limit exceeded for #{request.ip} on #{request.path}"
  when "blocklist.rack.attack"
    Rails.logger.warn "[Rack::Attack] Blocked request from #{request.ip} on #{request.path}"
  end
end