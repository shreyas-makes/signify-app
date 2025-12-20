# Notes From a Non-Techie: Deploying a Rails + Inertia (React) App to a VPS with Kamal

I am not a developer by training. I build apps with a lot of help from AI, and I write down what I learn so I do not repeat the same mistakes. This is my real-world deployment story for a Rails + Inertia (React) app on a VPS using Kamal.

If you are also shipping while learning, I hope this saves you a few hours.

## The short version (what worked)

- Buy a VPS and point your domain to it.
- Use Kamal to build and deploy your Docker image.
- Let Kamal’s proxy issue a free HTTPS certificate.
- Make sure both `signifywriting.com` and `www.signifywriting.com` are included, or `www` will fail.

## My actual process (and mistakes I made)

### 1) I trusted the LLM too much on Kamal config

The assistant suggested older Kamal config syntax. It told me to use `proxy.host` as a list or a space separated string. My Kamal version expects `proxy.hosts` for multiple domains.

Lesson: always check official docs before trusting config snippets.

Tip: Context7 has great `.md` docs for tools. I should have checked that earlier.

### 2) I did not realize Kamal deploys only committed code

I was changing `config/deploy.yml`, then running `bin/kamal deploy`, and wondering why nothing changed. Kamal builds from the committed Git state.

Fix: commit deploy config changes before running Kamal.

### 3) Docker was not running locally

Kamal builds the image on your laptop and pushes it to the registry. Docker Desktop was closed, so the build failed.

Fix: open Docker Desktop and run `docker ps`. If you see table headers, it is running.

### 4) My secrets were missing in the deploy shell

I hit this error:

```
ArgumentError: `secret_key_base` for production environment must be a type of String
```

That meant `SECRET_KEY_BASE` was empty in the shell running Kamal.

Fix:

```bash
export SECRET_KEY_BASE=$(bin/rails secret)
export RAILS_MASTER_KEY=$(cat config/master.key)
```

Also make sure `.kamal/secrets` references the ENV variables, not raw values.

### 5) DNS had extra records that broke HTTPS

I left a Namecheap URL redirect record in place. That added an extra IP and Let’s Encrypt got confused.

Fix: only keep:

- `A` record: `@` -> your VPS IP
- `CNAME` record: `www` -> your apex domain

If `dig +short yourdomain.com` shows multiple IPs, delete the extra ones.

### 6) `www` did not work even though the apex did

This one confused me the most. `https://signifywriting.com` worked, but `https://www.signifywriting.com` failed with a TLS error.

Fix: I needed to include **both** domains in Kamal’s proxy config:

```yaml
proxy:
  ssl: true
  hosts:
    - signifywriting.com
    - www.signifywriting.com
```

Then commit and deploy. The proxy will request certs for both.

## My current deploy checklist

1) `docker ps` works (Docker Desktop open)
2) `git status` is clean (deploy config committed)
3) `KAMAL_REGISTRY_PASSWORD`, `RAILS_MASTER_KEY`, `SECRET_KEY_BASE` exported
4) DNS only has the A and CNAME records
5) `proxy.hosts` includes both apex + www
6) `bin/kamal deploy`

## What I will do better next time

- Always check the latest docs before copying config from an AI.
- Keep a tiny “deploy preflight” checklist and run it every time.
- Document mistakes immediately while they are fresh.

If you are also learning by doing, I hope this helps. If I got something wrong, I will update this note.
