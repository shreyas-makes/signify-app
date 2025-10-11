# Signify Deployment Guide

## Prerequisites

1. **Hetzner VPS** with Docker installed
2. **Docker Hub account** (or other container registry)
3. **SSH access** to your VPS
4. **Domain name** (optional, can use IP address initially)

## Step 1: Environment Setup

### On your VPS:

```bash
# Install Docker if not already installed
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
sudo apt-get update
sudo apt-get install docker-compose-plugin

# Create app user (optional)
sudo useradd -m -s /bin/bash signify
sudo usermod -aG docker signify
```

### On your local machine:

1. Copy `.env.example` to `.env` and update values:
```bash
cp .env.example .env
```

2. Update `.env` with your VPS details:
```
RAILS_ENV=production
SECRET_KEY_BASE=generate_with_rails_secret
DATABASE_URL=sqlite3:storage/production.sqlite3
APP_DOMAIN=your.vps.ip.address
ALLOWED_HOSTS=your.vps.ip.address
FORCE_SSL=false
RACK_ATTACK_ENABLED=true
APP_NAME=Signify
ENABLE_REGISTRATION=true
```

## Step 2: Update Deployment Configuration

1. Update `config/deploy.yml`:
   - Replace `YOUR_HETZNER_VPS_IP` with your actual VPS IP
   - Replace `your-user` with your Docker Hub username
   - Set `host` to your VPS IP or domain

2. Update container registry credentials:
```bash
# Set your Docker Hub password
export KAMAL_REGISTRY_PASSWORD=your_docker_hub_token
```

## Step 3: Generate Secrets

```bash
# Generate Rails master key
bin/rails credentials:edit

# Generate secret key base
bin/rails secret
```

## Step 4: Create Kamal Secrets

Create `.kamal/secrets` file:
```
RAILS_MASTER_KEY=your_rails_master_key_here
SECRET_KEY_BASE=your_secret_key_base_here
KAMAL_REGISTRY_PASSWORD=your_docker_hub_token_here
```

## Step 5: Prepare Application

```bash
# Install dependencies
bundle install
npm install

# Precompile assets
bin/rails assets:precompile

# Run migrations (will be done during deployment too)
bin/rails db:migrate RAILS_ENV=production
```

## Step 6: Deploy

```bash
# Initial setup (first deployment)
bin/kamal setup

# For subsequent deployments
bin/kamal deploy
```

## Step 7: Post-Deployment

### Create an admin user:
```bash
# Connect to your app
bin/kamal app exec --interactive "bin/rails console"

# In Rails console:
user = User.create!(
  name: "Admin User",
  display_name: "Admin", 
  email: "admin@example.com",
  password: "secure_admin_password_123",
  verified: true
)
user.make_admin!
```

### Verify deployment:
```bash
# Check app status
bin/kamal app details

# View logs
bin/kamal app logs

# Check running containers
bin/kamal app exec "docker ps"
```

## Step 8: Configure Domain (Optional)

If you have a domain:

1. Point your domain's A record to your VPS IP
2. Update `config/deploy.yml`:
   ```yaml
   proxy:
     ssl: true
     host: yourdomain.com
   ```
3. Redeploy: `bin/kamal deploy`

## Useful Commands

```bash
# View application logs
bin/kamal logs

# Access Rails console
bin/kamal console

# Access shell
bin/kamal shell

# Database console
bin/kamal dbc

# Restart application
bin/kamal app restart

# Update environment variables
bin/kamal env push

# Rollback deployment
bin/kamal rollback [version]
```

## Troubleshooting

### App won't start:
```bash
# Check logs
bin/kamal app logs

# Check container status
bin/kamal app details

# SSH into VPS and check Docker
ssh user@your.vps.ip
docker ps -a
docker logs signify-web-latest
```

### Database issues:
```bash
# Run migrations
bin/kamal app exec "bin/rails db:migrate"

# Check database
bin/kamal dbc
```

### Asset issues:
```bash
# Precompile assets locally first
bin/rails assets:precompile
bin/kamal deploy
```

### Permission issues:
```bash
# Check file permissions on VPS
bin/kamal shell
ls -la /rails/storage
```

## Security Notes

1. **Change default passwords** immediately after deployment
2. **Backup your database** regularly: 
   ```bash
   bin/kamal app exec "cp /rails/storage/production.sqlite3 /rails/storage/backup-$(date +%Y%m%d).sqlite3"
   ```
3. **Monitor logs** for unusual activity
4. **Keep system updated**:
   ```bash
   # On VPS
   sudo apt update && sudo apt upgrade
   ```

## Monitoring

Check these URLs after deployment:
- `http://your.vps.ip/` - Main application
- `http://your.vps.ip/up` - Health check
- `http://your.vps.ip/admin` - Admin dashboard (admin users only)

## Backup Strategy

### Database Backup:
```bash
# Create backup
bin/kamal app exec "bin/rails runner 'File.copy(\"/rails/storage/production.sqlite3\", \"/rails/storage/backup-#{Time.current.strftime(\"%Y%m%d-%H%M%S\")}.sqlite3\")'"

# Download backup
scp user@your.vps.ip:/path/to/backup.sqlite3 ./local-backup.sqlite3
```

### Full Application Backup:
```bash
# Backup storage volume
bin/kamal app exec "tar -czf /tmp/signify-backup-$(date +%Y%m%d).tar.gz /rails/storage"
```

## Performance

For production optimization:
1. Consider using PostgreSQL instead of SQLite
2. Set up Redis for caching
3. Use a CDN for assets
4. Monitor with application performance tools

Your Signify application should now be running securely on your Hetzner VPS!