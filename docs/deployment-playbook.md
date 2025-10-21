**Why this setup?**
- Docker Desktop provides the Docker daemon and build tools needed to create Linux containers on macOS/Windows. These containers mirror the Linux environment on your Hetzner VPS, ensuring images you build locally will run there.
- Kamal builds, pushes, and deploys Docker images. It needs three secrets—Rails master key, Rails secret key base, and Docker Hub token—so the containers boot correctly and the image push to Docker Hub succeeds.

**Docker Desktop setup (local laptop)**
- Install Docker Desktop from https://www.docker.com/products/docker-desktop
- Launch Docker Desktop and ensure it's running (look for the Docker icon in your menu bar/system tray)
- Verify installation: `docker --version` and `docker info | head -n 5`
- **Important**: Ensure Docker Desktop can build for the correct architecture:
  - Open Docker Desktop → Settings → General
  - Make sure "Use Virtualization Framework" is enabled
  - Verify multi-platform support: `docker buildx ls` should show `linux/amd64` support

**Preparing secrets (local)**
- `export RAILS_MASTER_KEY=$(cat config/master.key)`  
  Rails decrypts `config/credentials.yml.enc` using this key at boot; without it the app crashes.
- `export SECRET_KEY_BASE=$(bundle exec rails secret)`  
  Provides the cryptographic base used for session cookies, CSRF, etc. Generating one per deployment environment is typical.
- `export KAMAL_REGISTRY_PASSWORD='<token>'`  
  Authenticates pushes to Docker Hub (`railshobbyist/signify`). Use a personal access token rather than your account password.
- Keep these exports in the same shell session whenever you run `bin/kamal …`; Kamal reads them at runtime and injects them into `.kamal/secrets`.

**Kamal configuration reminders**
- `config/deploy.yml` already targets `railshobbyist/signify`, VPS `91.98.196.39`, and sets the proxy to HTTP only.
- `.kamal/secrets` maps the three environment variables above; the actual secret values never hit git.

**Deployment workflow (local commands hitting the VPS)**
- `docker login`  
  Ensures the local builder can push images to your Docker Hub repository.
- `bin/kamal setup` (first run)  
  Builds the production image, pushes to Docker Hub, installs the Traefik proxy + app container on the VPS, and creates persistent volumes.
- `bin/kamal deploy` (future runs)  
  Rebuilds/redeploys the app without reinitialising the server.
- Observability helpers: `bin/kamal logs` tails the running container; `bin/kamal console` opens a Rails console inside it for debugging.

**Server-side expectations (run once on the VPS)**
- VPS already has Docker and the compose plugin (see `DEPLOYMENT.md` if you need to reinstall).
- SSH key `~/.ssh/opensoftwaretools` is listed in `config/deploy.yml`; Kamal uses it for passwordless root access.
- With no domain yet, the app is served on plain HTTP at `http://91.98.196.39`. Later, swap `proxy.ssl` to `true`, set `proxy.host` to your domain, open port 443, and redeploy for automatic TLS.

**Troubleshooting quick notes**
- Prompted for a root password during deploy → public key missing on the VPS. Add it to `/root/.ssh/authorized_keys`.
- Docker commands say "Cannot connect to the Docker daemon" → Docker Desktop isn't running. Launch Docker Desktop and wait for it to fully start.
- Forgot the environment exports → rerun the three `export` commands before invoking Kamal.
- Build fails with architecture errors → Verify `docker buildx ls` shows `linux/amd64` platform support.
