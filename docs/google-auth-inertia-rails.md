# Google Auth (GIS) for Inertia Rails + React (VPS/Kamal)

This is a working reference for adding Google Identity Services (GIS) sign-in
to a Rails + Inertia + React app with a custom sessions table (no Devise).
It includes the exact wiring and the common SSL/CRL issues hit during setup.

## Approach Used

- Use GIS ID tokens on the client.
- Post the `credential` (JWT) to Rails.
- Rails validates the token server-side and creates a session record.
- Keep existing email/password login alongside Google sign-in.

## Google Cloud Setup

1) Create an OAuth client (Web application).
2) Add Authorized JavaScript origins:
   - `http://localhost:3000`
   - `http://127.0.0.1:3000`
   - `https://signifywriting.com`
   - `https://www.signifywriting.com`
3) Redirect URIs are not used by GIS, but can be set for future OAuth flows.
4) Copy the OAuth Client ID.

## App Config

### Frontend (Vite env)

Export a client ID for GIS:

```sh
export VITE_GOOGLE_CLIENT_ID="YOUR_CLIENT_ID.apps.googleusercontent.com"
```

#### Production build (Kamal + Docker)

Vite reads `VITE_` variables at build time, so the production image must receive
the client ID during the Docker build.

1) Add the build arg in `config/deploy.yml`:

```yaml
builder:
  args:
    VITE_GOOGLE_CLIENT_ID: "YOUR_CLIENT_ID.apps.googleusercontent.com"
```

2) Ensure the Docker build accepts it (already wired in `Dockerfile`):

```dockerfile
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
```

3) Redeploy so assets are rebuilt with the value:

```sh
bin/kamal redeploy
```

### Backend (Rails credentials)

Edit credentials:

```sh
EDITOR="nano" bin/rails credentials:edit
```

Add:

```yaml
google:
  client_id: "YOUR_CLIENT_ID.apps.googleusercontent.com"
```

The frontend and backend client IDs must match exactly, or you will see
`Token client-id mismatch` in server logs.

## Code Wiring

### Gem

```ruby
gem "google-id-token"
```

### Route

```ruby
post "google_sign_in", to: "identity/google_sessions#create"
```

### Controller

Create `Identity::GoogleSessionsController`:

- Validate token with `GoogleIDToken::Validator`.
- Create/find `User`.
- Create `Session`.
- Set `cookies.signed.permanent[:session_token]`.

Important: the validator call should only pass the audience:

```ruby
validator = GoogleIDToken::Validator.new
validator.check(credential, client_id)
```

If you pass a third argument incorrectly, you can trigger `Token client-id mismatch`.

### Login UI (React)

- Load GIS script in the login page `<Head>`.
- Render a Google button with `google.accounts.id.renderButton`.
- Post `{ credential }` to `/google_sign_in` (Inertia `router.post`).
- Keep the existing email/password form on the same page.

## Local SSL/CRL Error (macOS + OpenSSL)

Symptom:

```
OpenSSL::SSL::SSLError: certificate verify failed (unable to get certificate CRL)
```

This happens while the `google-id-token` gem fetches Google certs.

### Workaround (dev only)

Patch the gem's cert fetch to skip CRL validation in development:

`config/initializers/google_id_token_dev_ssl.rb`

```ruby
if Rails.env.development?
  require "google-id-token"
  require "net/http"
  require "json"
  require "openssl"

  module GoogleIDToken
    class Validator
      private

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
```

This is dev-only and avoids CRL failures without disabling verification globally.

### OpenSSL Pin (optional)

If CRL issues persist, pin OpenSSL:

```ruby
gem "openssl", "~> 3.3.2"
```

Then:

```sh
bundle install
```

### Environment Hints (optional)

These can help with OpenSSL cert discovery:

```sh
export SSL_CERT_FILE=/etc/ssl/cert.pem
export SSL_CERT_DIR=/etc/ssl/certs
export OPENSSL_CONF=/etc/ssl/openssl.cnf
```

## Debug Checklist

1) Client IDs match (frontend + Rails credentials).
2) Google origins match the URL you are using (`localhost` vs `127.0.0.1`).
3) `GoogleIDToken::Validator` call uses only the audience.
4) If SSL CRL errors, apply the dev initializer workaround.

## VPS/Kamal Notes

- Use the same OAuth client ID for production domains.
- Add production domains to Authorized JavaScript origins.
- Avoid dev-only SSL workarounds in production.
- If the login page shows "Google sign-in is not configured," the production build
  is missing `VITE_GOOGLE_CLIENT_ID`. Confirm the build arg and redeploy.
