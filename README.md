# nginxpm

This project comes as a pre-built Docker image that enables you to easily forward to your websites
running at home or otherwise, including free SSL, without having to know too much about Nginx or Letsencrypt.

- [Quick Setup](#quick-setup)
- [Full Setup](https://nginxproxymanager.com/setup/)
- [Screenshots](https://nginxproxymanager.com/screenshots/)

## Project Goal

Reverse proxying hosts with SSL termination made as simple as possible.
This is a fork from Nginx Proxy Manager as of Aug 2026.
The objective is to apply what i have learn in my study to a repository i personally used and will maintain moving forward.

Main differences from the upstream:
1. Base OS & Core Binaries: Debian 13 Trixie, NGINX from nginx.org, SQLite, MariaDB LTS, PostgreSQL alpine.
2. Frontend/Backend: Updated packages dependencies
3. Certbot: Managed via pipx.
4. CI/CD: Only support linux/amd64 and linux/arm64

## Features

- Beautiful and Secure Admin Interface based on [Tabler](https://tabler.github.io/)
- Easily create forwarding domains, redirections, streams, and 404 hosts without knowing anything about Nginx
- Free SSL using Let's Encrypt or provide your own custom SSL certificates
- Access Lists and basic HTTP Authentication for your hosts
- Advanced Nginx configuration available for super users
- User management, permissions, and audit log

::: info Supported Architectures
`nginxpm` supports 64-bit platforms: **`linux/amd64`** (x86_64) and **`linux/arm64`** (aarch64).
32-bit ARM (`armv7`/`armhf`) is not supported due to Node.js 22 LTS requirements.
:::

## Hosting your home network

1. Your home router will have a Port Forwarding section somewhere. Log in and find it
2. Add port forwarding for ports 80 and 443 to the server hosting this project
3. Configure your domain name details to point to your home, either with a static ip or a service like
   - DuckDNS
   - [Amazon Route53](https://github.com/linuxserver/docker-route53-ddns)
   - [Cloudflare](https://github.com/timothymiller/cloudflare-ddns)
4. Use **nginxpm** as your gateway to forward to your other web-based services

## Quick Setup

1. [Install Docker](https://docs.docker.com/install/)
2. Create a docker-compose.yml file similar to this:

```yml
services:
  app:
    image: 'docker.io/teoks/nginxpm:latest'
    restart: unless-stopped
    ports:
      - '80:80'
      - '81:81'
      - '443:443'
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
```

This is the bare minimum configuration required. See the [documentation](https://nginxproxymanager.com/setup/) for more.

3. Bring up your stack by running

```bash
docker compose up -d
```

4. Log in to the Admin UI

When your docker container is running, connect to it on port `81` for the admin interface.
Sometimes this can take a little bit because of the entropy of keys.

[http://127.0.0.1:81](http://127.0.0.1:81)

### Contributors

Special thanks to [all of Nginx Proxy Manager contributors](https://github.com/NginxProxyManager/nginx-proxy-manager/graphs/contributors).

