**Why this setup?**
- macOS cannot run Linux containers natively, so we install the Docker CLI plus Colima, which spins up a lightweight Linux VM that acts as the Docker daemon. That VM mirrors the Linux environment on your Hetzner VPS, ensuring images you build locally (on your laptop) will run there.
- Kamal builds, pushes, and deploys Docker images. It needs three secrets—Rails master key, Rails secret key base, and Docker Hub token—so the containers boot correctly and the image push to Docker Hub succeeds.

**Homebrew tooling (local laptop)**
- `brew install docker docker-compose docker-buildx colima`  
  Installs the CLI (`docker`), compose/build plugins, and Colima (the local VM/daemon). Without Colima the CLI has nowhere to send commands.
- Update Docker plugin search path by creating or extending `~/.docker/config.json`:
  ```json
  {
    "cliPluginsExtraDirs": ["/opt/homebrew/lib/docker/cli-plugins"]
  }
  ```
  This lets the CLI auto-detect the Homebrew-managed plugins.

**Starting the local Docker daemon (still local)**
- `colima start --arch x86_64 --cpu 2 --memory 4 --disk 60`  
  Boots a Linux VM that provides the Docker API. `--arch x86_64` makes the VM produce amd64 images, matching the Hetzner CPU. CPU/RAM/disk flags size the VM.
- `docker context use colima`  
  Points the Docker CLI at that VM instead of the default (nonexistent) local engine.
- Check everything is alive: `docker --version` (CLI available) and `docker info | head -n 5` (confirms Colima is the server). If the info command fails, `colima status` or `colima restart` usually fixes it.

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
- Docker commands say “Cannot connect to the Docker daemon” → Colima isn’t running or `docker context` isn’t set.
- Forgot the environment exports → rerun the three `export` commands before invoking Kamal.
