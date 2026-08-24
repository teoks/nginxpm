# syntax=docker/dockerfile:1
# ============================================================
# nginxpm — rebuilt from official upstream sources
# Base: debian:trixie-slim (Debian 13)
# NGINX: official nginx.org repo
# Node.js: official NodeSource repo (Node 22 LTS)
# Certbot: official via pipx
# ============================================================
# Build with: docker buildx build --platform linux/amd64,linux/arm64
# This file assumes that the frontend has been built using ./scripts/ci/frontend-build

ARG DEBIAN_VERSION=trixie-slim
ARG NODE_MAJOR=22

# ─── Stage 0: Test CA (used in CI/dev; safe to keep in prod) ──────────────────
FROM nginxproxymanager/testca AS testca

# ─── Stage 1: Final Image ─────────────────────────────────────────────────────
FROM debian:${DEBIAN_VERSION}

ARG TARGETPLATFORM
ARG BUILD_VERSION
ARG BUILD_COMMIT
ARG BUILD_DATE
ARG NODE_MAJOR

# See: https://github.com/just-containers/s6-overlay/blob/master/README.md
ENV SUPPRESS_NO_CONFIG_WARNING=1 \
	S6_BEHAVIOUR_IF_STAGE2_FAILS=1 \
	S6_CMD_WAIT_FOR_SERVICES_MAXTIME=0 \
	S6_FIX_ATTRS_HIDDEN=1 \
	S6_KILL_FINISH_MAXTIME=10000 \
	S6_VERBOSITY=1 \
	NODE_ENV=production \
	NPM_BUILD_VERSION="${BUILD_VERSION}" \
	NPM_BUILD_COMMIT="${BUILD_COMMIT}" \
	NPM_BUILD_DATE="${BUILD_DATE}"

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# ─── Prerequisites ─────────────────────────────────────────────────────────────
RUN echo "fs.file-max = 65535" > /etc/sysctl.conf \
	&& apt-get update \
	&& apt-get install -y --no-install-recommends \
		ca-certificates \
		curl \
		gnupg \
		xz-utils \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*

# ─── Official NGINX from nginx.org repo ───────────────────────────────────────
RUN curl -fsSL https://nginx.org/keys/nginx_signing.key \
		| gpg --dearmor -o /usr/share/keyrings/nginx-archive-keyring.gpg \
	&& echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
		https://nginx.org/packages/debian trixie nginx" \
		> /etc/apt/sources.list.d/nginx.list \
	&& apt-get update \
	&& apt-get install -y --no-install-recommends \
		nginx \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*

# ─── Official Node.js 22 LTS from NodeSource ──────────────────────────────────
RUN curl -fsSL https://deb.nodesource.com/setup_${NODE_MAJOR}.x | bash - \
	&& apt-get install -y --no-install-recommends nodejs \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/* \
	&& npm install -g yarn --no-fund --no-audit

# ─── System packages ──────────────────────────────────────────────────────────
# apache2-utils : htpasswd for access lists & auth
# openssl       : SSL/TLS operations & key generation
# libssh2-1t64  : SSH/SSL runtime support
RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		apache2-utils \
		openssl \
		libssl3t64 \
		libssh2-1t64 \
		jq \
		logrotate \
		pipx \
		python3 \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*

# ─── Certbot (official via pipx — isolated Python env, no system pollution) ───
RUN PIPX_HOME=/opt/pipx PIPX_BIN_DIR=/usr/local/bin pipx install certbot \
	&& PIPX_HOME=/opt/pipx PIPX_BIN_DIR=/usr/local/bin pipx inject certbot \
		certbot-dns-cloudflare \
		certbot-dns-route53 \
		certbot-dns-digitalocean \
		certbot-dns-google \
		certbot-dns-luadns \
		certbot-dns-ovh \
		certbot-dns-rfc2136

# ─── s6-overlay (process supervisor) ──────────────────────────────────────────
COPY docker/scripts/install-s6 /tmp/install-s6
RUN /tmp/install-s6 "${TARGETPLATFORM}" && rm -f /tmp/install-s6

# ─── Backend dependencies (cached layer) ──────────────────────────────────────
WORKDIR /app
COPY backend/package.json backend/yarn.lock /app/
RUN apt-get update \
	&& apt-get install -y --no-install-recommends build-essential python3-dev \
	&& yarn install --production --frozen-lockfile \
	&& yarn cache clean \
	&& apt-get purge -y build-essential python3-dev \
	&& apt-get autoremove -y \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*

# ─── Application files ────────────────────────────────────────────────────────
COPY backend       /app
COPY frontend/dist /app/frontend
COPY docker/rootfs /

# ─── Test CA cert (for CI/dev; harmless in prod) ──────────────────────────────
COPY --from=testca /home/step/certs/root_ca.crt /etc/ssl/certs/NginxProxyManager.crt
WORKDIR /etc/ssl/certs
RUN ln -s NginxProxyManager.crt 1d0e3f10.0 && update-ca-certificates

# ─── Cleanup: remove dev-only s6 service and nginx dev config ─────────────────
RUN rm -rf /etc/s6-overlay/s6-rc.d/user/contents.d/frontend \
		/etc/nginx/conf.d/dev.conf \
	&& chmod 644 /etc/logrotate.d/nginx-proxy-manager

EXPOSE 80 81 443
VOLUME ["/data"]
ENTRYPOINT ["/init"]

LABEL org.label-schema.schema-version="1.0" \
	org.label-schema.license="MIT" \
	org.label-schema.name="nginxpm" \
	org.label-schema.description="Docker container for managing Nginx proxy hosts with a simple, powerful interface" \
	org.label-schema.url="https://github.com/teoks/nginxpm" \
	org.label-schema.vcs-url="https://github.com/teoks/nginxpm.git" \
	org.label-schema.cmd="docker run --rm -ti teoks/nginxpm:latest"
