# frozen_string_literal: true

if Rails.env.development?
  require "google-id-token"
  require "net/http"
  require "json"
  require "openssl"

  module GoogleIDToken
    class Validator
      private

      # Avoid CRL validation failures when fetching Google certs in local dev.
      def old_skool_refresh_certs
        return true unless certs_cache_expired?

        uri = URI(GOOGLE_CERTS_URI)
        http = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl = true
        http.verify_mode = OpenSSL::SSL::VERIFY_NONE
        res = http.get(uri.request_uri)

        if res.is_a?(Net::HTTPSuccess)
          new_certs = Hash[JSON.load(res.body).map do |key, cert|
            [key, OpenSSL::X509::Certificate.new(cert)]
          end]
          @certs.merge! new_certs
          @certs_last_refresh = Time.now
          true
        else
          false
        end
      end
    end
  end
end
