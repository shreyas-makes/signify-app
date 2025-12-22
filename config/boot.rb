# frozen_string_literal: true

ENV["BUNDLE_GEMFILE"] ||= File.expand_path("../Gemfile", __dir__)
if ENV["SSL_CERT_FILE"].nil? && File.exist?("/etc/ssl/cert.pem")
  # Ensure OpenSSL can validate outbound TLS calls in local dev.
  ENV["SSL_CERT_FILE"] = "/etc/ssl/cert.pem"
end

require "bundler/setup" # Set up gems listed in the Gemfile.
require "bootsnap/setup" # Speed up boot time by caching expensive operations.
