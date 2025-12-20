# Kamal + SQLite Deployment Checklist (Inertia on Rails)

Use this as a repeatable checklist for deploying Inertia on Rails apps to a VPS with Kamal and SQLite.

## Prereqs

- VPS with Docker installed and running
- SSH access to the VPS user that can run Docker
- Docker Hub (or other registry) credentials with **push** access
- Project has a working Dockerfile and Kamal config
- Local Docker daemon is running (Docker Desktop open on macOS)

## One-time VPS setup

```bash
# SSH in
ssh -i ~/.ssh/your_key user@your.vps.ip

# Install Docker (if not installed)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Optional: add user to docker group
sudo usermod -aG docker user
```

## Project configuration (local)

1. Update `config/deploy.yml`:

- `image: <dockerhub-user>/<app-name>`
- `servers.web: [<vps-ip>]`
- `proxy.host: <vps-ip>` and keep `proxy.ssl: false` if no domain
- `registry.username: <dockerhub-user>`
- `env.clear` add:
  - `APP_DOMAIN: <vps-ip>`
  - `ALLOWED_HOSTS: <vps-ip>`
- `builder.cache.image: <dockerhub-user>/<app-name>-build-cache`
- `ssh.user` and `ssh.keys`

2. Ensure SQLite is configured for production and a persistent volume is mounted:

- `config/database.yml` uses `storage/production.sqlite3`
- `config/deploy.yml` has:
  ```yaml
  volumes:
    - "<app>_storage:/rails/storage"
  ```

## Secrets

- Generate Rails secret key base:
  ```bash
  bin/rails secret
  ```

- Export secrets in your shell (same terminal you run Kamal from):
  ```bash
  export KAMAL_REGISTRY_PASSWORD=your_dockerhub_token
  export RAILS_MASTER_KEY=$(cat config/master.key)
  export SECRET_KEY_BASE=your_generated_secret
  ```

- Ensure `.kamal/secrets` references ENV variables (no raw values):
  ```bash
  KAMAL_REGISTRY_PASSWORD=$KAMAL_REGISTRY_PASSWORD
  RAILS_MASTER_KEY=$RAILS_MASTER_KEY
  SECRET_KEY_BASE=$SECRET_KEY_BASE
  ```

## Important: commit changes before deploy

Kamal builds from the **committed** git state and ignores uncommitted changes.

Before deploy:
```bash
git status
```
Commit any deploy-related changes (like `config/deploy.yml`, `config/credentials.yml.enc`, etc.).

## Docker Hub setup

- Create a repo named after your app (e.g., `signify`)
- Create an access token with **Read & Write** permissions
- Log in locally:
  ```bash
  docker logout
  docker login -u <dockerhub-user>
  ```
  Confirm the daemon is running:
  ```bash
  docker ps
  ```
  You should see headers like `CONTAINER ID` even if no containers are running.

## Deploy

```bash
bin/kamal setup
bin/kamal deploy
```

## SSL / domain cert

- Set `proxy.ssl: true` and `proxy.host: <your-domain>` in `config/deploy.yml`
- Set `APP_DOMAIN` and `ALLOWED_HOSTS` to the domain (include `www` if you use it)
- Wait for DNS to point at the VPS IP
- Run `bin/kamal deploy` (or `bin/kamal proxy restart` if the app is already up)
- Ensure DNS does not include any extra A records or URL redirect records
  - Only keep `A @ -> <vps-ip>` and `CNAME www -> <your-domain>`
  - If `dig +short <your-domain>` shows multiple IPs, delete the extra one

## Healthcheck / troubleshooting

If the container fails to become healthy:

```bash
# From local
bin/kamal app logs
bin/kamal app details

# From VPS
ssh -i ~/.ssh/your_key user@your.vps.ip
docker ps -a
docker logs <container-id>
```

Common issues:

- **Credentials error** (`ActiveSupport::MessageEncryptor::InvalidMessage`):
  - `RAILS_MASTER_KEY` doesn’t match the committed `config/credentials.yml.enc`
  - Commit `config/credentials.yml.enc` and redeploy

- **Zeitwerk error** (constant mismatch):
  - Ensure file name matches module/class name
  - Example: `lib/debug_helpers.rb` must define `DebugHelpers`

- **Docker login fails**:
  - Make sure `KAMAL_REGISTRY_PASSWORD` is exported
  - Token needs push scope
  - If you see `flag needs an argument: 'p'`, the env var is empty or unset
    ```bash
    echo "$KAMAL_REGISTRY_PASSWORD"
    docker login -u <dockerhub-user>
    ```

- **Sign in / Sign up hangs on IP (no domain)**:
  - If `config.assume_ssl = true` in production, Inertia requests return `409` with `X-Inertia-Location: https://<ip>`
  - Fix by toggling `assume_ssl` via ENV:
    ```ruby
    # config/environments/production.rb
    config.assume_ssl = ENV.fetch("ASSUME_SSL", ENV.fetch("FORCE_SSL", "false")) == "true"
    ```
  - Keep `FORCE_SSL=false` and `ASSUME_SSL=false` for IP-only deployments

## Notes

- Assets are precompiled in the Dockerfile; you do not need to run `assets:precompile` locally for Kamal deploys.
- `db:prepare` runs automatically on container boot via `bin/docker-entrypoint` if your Dockerfile matches this pattern.
- You can deploy to an IP address without a domain; keep `proxy.ssl: false` and `FORCE_SSL: false`.

## Optional post-deploy checks

```bash
bin/kamal app details
bin/kamal app logs
```

Visit:
- `http://<vps-ip>/`
- `http://<vps-ip>/up`
