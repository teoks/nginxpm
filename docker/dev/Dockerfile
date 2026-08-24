# syntax=docker/dockerfile:1
# ============================================================
# nginxpm DEV image — official upstream sources
# For local development only. App code is bind-mounted at runtime.
# ============================================================

ARG DEBIAN_VERSION=trixie-slim
ARG NODE_MAJOR=22

# ─── Stage 0: Test CA ──────────────────────────────────────────────────────────
FROM nginxproxymanager/testca AS testca

# ─── Dev Image ─────────────────────────────────────────────────────────────────
FROM debian:${DEBIAN_VERSION}

ARG TARGETPLATFORM
ARG NODE_MAJOR

LABEL maintainer="teoks"

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

ENV SUPPRESS_NO_CONFIG_WARNING=1 \
	S6_BEHAVIOUR_IF_STAGE2_FAILS=1 \
	S6_CMD_WAIT_FOR_SERVICES_MAXTIME=0 \
	S6_FIX_ATTRS_HIDDEN=1 \
	S6_KILL_FINISH_MAXTIME=10000 \
	S6_VERBOSITY=2

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

# ─── Official Node.js 22 from NodeSource ──────────────────────────────────────
RUN curl -fsSL https://deb.nodesource.com/setup_${NODE_MAJOR}.x | bash - \
	&& apt-get install -y --no-install-recommends nodejs \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/* \
	&& npm install -g yarn --no-fund --no-audit

# ─── System packages + dev extras ─────────────────────────────────────────────
# moreutils: provides sponge, ts, etc. — used in dev scripts
RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		apache2-utils \
		openssl \
		libssl3t64 \
		libssh2-1t64 \
		jq \
		logrotate \
		moreutils \
		pipx \
		python3 \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*

# ─── Certbot (official via pipx) ──────────────────────────────────────────────
RUN PIPX_HOME=/opt/pipx PIPX_BIN_DIR=/usr/local/bin pipx install certbot \
	&& PIPX_HOME=/opt/pipx PIPX_BIN_DIR=/usr/local/bin pipx inject certbot \
		certbot-dns-cloudflare \
		certbot-dns-route53 \
		certbot-dns-digitalocean \
		certbot-dns-google \
		certbot-dns-luadns \
		certbot-dns-ovh \
		certbot-dns-rfc2136

# ─── Taskfile (dev task runner) ────────────────────────────────────────────────
WORKDIR /usr
RUN curl -sL 'https://taskfile.dev/install.sh' | sh

# ─── rootfs overlay ────────────────────────────────────────────────────────────
COPY rootfs /

# ─── s6-overlay ────────────────────────────────────────────────────────────────
COPY scripts/install-s6 /tmp/install-s6
RUN rm -f /etc/nginx/conf.d/production.conf.template \
	&& chmod 644 /etc/logrotate.d/nginx-proxy-manager \
	&& /tmp/install-s6 "${TARGETPLATFORM}" \
	&& rm -f /tmp/install-s6 \
	&& chmod 644 -R /root/.cache

# ─── Test CA cert ──────────────────────────────────────────────────────────────
COPY --from=testca /home/step/certs/root_ca.crt /etc/ssl/certs/NginxProxyManager.crt
WORKDIR /etc/ssl/certs
RUN ln -s NginxProxyManager.crt 1d0e3f10.0 && update-ca-certificates

WORKDIR /root

EXPOSE 80 81 443
ENTRYPOINT ["/init"]
