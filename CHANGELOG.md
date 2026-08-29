# Changelog — nginxpm

All notable changes and initial release features for **nginxpm** (`teoks/nginxpm`) are documented below.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased] - 2026-08-29

### 🔄 **GitHub Actions & CI/CD Updates**

- **GitHub Actions Versions (`.github/workflows/`)**:
  - Upgraded `actions/checkout` from `4.4.0` to `7.0.1`.
  - Upgraded `actions/download-artifact` from `4.3.0` to `8.0.1`.
  - Upgraded `actions/upload-artifact` from `4.6.2` to `7.0.1`.
  - Upgraded `actions/setup-node` from `4.4.0` to `7.0.0`.
  - Upgraded `actions/stale` from `10` to `11`.
- **Docker Action Versions (`.github/workflows/`)**:
  - Upgraded `docker/setup-qemu-action` from `3.7.0` to `4.2.0`.
  - Upgraded `docker/build-push-action` from `6.19.2` to `7.3.0`.
  - Upgraded `docker/setup-buildx-action` from `3.12.0` to `4.3.0`.
  - Upgraded `docker/login-action` from `3.7.0` to `4.6.0`.
  - Upgraded `docker/metadata-action` from `5.10.0` to `6.2.0`.

### 📦 **Dependency Updates**

- **Backend Dependencies (`backend/package.json`, `backend/yarn.lock`, `backend/package-lock.json`)**:
  - Upgraded `express-rate-limit` from `7.5.1` to `8.6.2` (includes API and configuration updates).
- **Test Dependencies (`test/package.json`, `test/yarn.lock`)**:
  - Upgraded `@quobix/vacuum` from `0.26.8` to `0.30.0` (OpenAPI linting improvements).
- **Backend Dev Dependencies (`backend/package.json`, `backend/yarn.lock`)**:
  - Upgraded `@biomejs/biome` from `2.5.7` to `2.5.9` (patch release with bug fixes).

### 🛠️ **Workflow & Configuration Improvements**

- **CI/CD Pipelines (`.github/workflows/`)**:
  - Added frontend build linting workflow (`frontend-ci.yml`).
  - Added backend linting and test workflow (`backend-ci.yml`).
  - Added Docker multi-architecture image build workflow (`docker-build.yml`).
  - Refactored Dependabot configuration with reusable npm template for better maintainability.
  - Updated dependency groups for backend and frontend packages.
  - Reduced maximum open pull requests limit for npm, docker, and GitHub Actions to prevent PR queue buildup.
- **Documentation & Repository**:
  - Cleaned up README by removing header images and badges for a more minimal presentation.
- **Build Metadata**:
  - Updated software bill of materials (SBOM) with current dependency versions.

---

## [1.0.0] - 2026-08-24 — Initial Release of `nginxpm`

## `fix(security): Remediate 40 CodeQL code scanning alerts across workflows, backend & frontend`

- **GitHub Actions Workflows (`.github/workflows/`)**:
  - Added explicit least-privilege `permissions:` across `build-and-publish.yml` and `stale.yml`.
  - Pinned all GitHub Action steps to immutable commit SHAs with version comments.
- **Backend Security & Route Hardening (`backend/`)**:
  - **Rate Limiting**: Introduced `express-rate-limit` middleware (`authLimiter`, `certDownloadLimiter`) across `/tokens`, `/tokens/2fa`, `/users/:user_id/login`, and `/api/nginx/certificates/:cer[...]
  - **CORS**: Removed unnecessary credentials reflection in `backend/lib/express/cors.js`.
  - **Type & Bypass Hardening**: Hardened token parsing and 2FA authentication validation in `backend/models/token.js` and `backend/internal/2fa.js`.
  - **Prototype Pollution Prevention**: Replaced mutable plugin assignments in `backend/lib/certbot.js` and dynamic object lookups in `backend/internal/certificate.js`.
  - **Command Injection Hardening**: Migrated shell command invocations in `backend/internal/certificate.js` and `backend/setup.js` to `execFile` and native `fs.promises.rm`.
- **Code Quality & Syntax Notices**:
  - Fixed ASI semicolon omissions in `access-list.js`, `dead-host.js`, and `regenerate-config`.
  - Fixed TOCTOU file system race in `frontend/src/locale/scripts/locale-sort.cjs`.
  - Fixed global variable hoist / declaration in `frontend/index.html` and removed unused variables in `frontend/check-locales.cjs`.
  - Cleaned up redundant defensive logging in `backend/internal/certificate.js`.

---

## `fix(security): Remediate open vulnerabilities across backend, test, docs & frontend`

- **Backend Dependencies (`backend/package.json`, `backend/yarn.lock`, `backend/package-lock.json`)**:
  - Upgraded `liquidjs` to `10.29.0` (resolving high-severity memory limit bypass in `pop` filter).
  - Upgraded `knex` to `3.3.0`, `body-parser` to `^2.3.0`, `mysql2` to `^3.23.4`, `otplib` to `^13.5.0`, `pg` to `^8.23.0`, `proxy-agent` to `^8.0.2`, `@apidevtools/json-schema-ref-parser` to `^16[...]
  - Backend package audit clean (0 vulnerabilities).
- **Frontend Lockfiles & Resolutions (`frontend/package.json`, `frontend/package-lock.json`, `frontend/yarn.lock`)**:
  - Enforced `nanoid` resolution `^3.3.18` and updated lockfiles (0 vulnerabilities in frontend audit).
- **Docs Dependencies & Resolutions (`docs/package.json`, `docs/yarn.lock`)**:
  - Added resolutions for `vite` (`^6.4.3`) and `esbuild` (`^0.25.0`), resolving path traversal and development server vulnerabilities.
- **Test Subsystem Dependencies & Resolutions (`test/package.json`, `test/yarn.lock`)**:
  - Added resolutions for `serialize-javascript` (`^7.0.5`, resolved to `7.1.0`), `underscore` (`^1.13.8`), and `diff` (`^8.0.3`, resolved to `8.0.4`), eliminating all transitive DoS/RCE advisorie[...]
  - Upgraded `tar` to `7.5.22` (resolving critical decompression DoS and PAX header smuggling advisories).
  - Upgraded `axios` to `1.19.0`, `form-data` to `4.0.6`, `systeminformation` to `5.33.1`, `jsonpath` to `1.3.0`, `minimatch` to `10.2.6`, `cypress` to `15.21.0`, `eslint-plugin-cypress` to `7.0.1[...]

---

## `fix(security): Bump nanoid & fast-uri security patches (#31, #32)`

- **Docs Dependencies (`docs/yarn.lock`)**:
  - Upgraded `nanoid` (`3.3.11` → `3.3.18`) resolving security advisory on docs generation (PR #31).
- **Test Dependencies (`test/yarn.lock`)**:
  - Upgraded `fast-uri` (`3.1.2` → `3.1.6`) resolving high-severity URI normalization and canonicalization advisories GHSA-5jgf-p345-68v8, GHSA-fph4-wmhf-6fwf, GHSA-f65p-4m7j-42xc, and GHSA-jqff[...]

---

## `fix(backend): Fix missing new on PermissionError in access.can()`

- **Access Control & Authorization (`backend/lib/access.js`)**:
  - Added missing `new` keyword when instantiating `errs.PermissionError` inside the `access.can()` catch block.
  - Resolves an issue where authorization check failures threw `undefined`, causing requests to erroneously fall through to the catch-all router with a `404 Not Found` response instead of returnin[...]

---

## `feat(frontend): Update frontend packages & migrate to TanStack Table v9`

- **Frontend Architecture & Table Migration (`frontend/src/components/Table/features.ts`, `TableLayout.tsx`, and all admin pages)**:
  - Migrated `@tanstack/react-table` from v8 to **v9.1.2** with full feature registration (`rowSortingFeature`, `columnVisibilityFeature`, `metaHelper`).
  - Refactored table components across Proxy Hosts, Dead Hosts, Redirection Hosts, Streams, Access Lists, Certificates, Users, and Audit Log.
- **UI Bug Fix (`frontend/src/components/SiteMenu.tsx`)**:
  - Removed `data-bs-auto-close="outside"` to prevent the "Hosts" navigation dropdown menu from getting stuck open after selecting an item.
- **Frontend Dependencies (`frontend/package.json`, `frontend/yarn.lock`)**:
  - Upgraded `@tabler/icons-react` to `^3.46.0`, `@tanstack/react-query` to `^5.101.4`, `react` & `react-dom` to `^19.2.8`, `react-router-dom` to `^7.18.2`, `typescript` to `7.0.2`, `vite` to `^8.[...]
  - Ported from upstream `4ecb0472`.

---

## Commit `d67be457` - `packages update`

- **Backend Dependencies (`backend/package.json`, `backend/yarn.lock`, `backend/package-lock.json`)**:
  - Upgraded `better-sqlite3` (`^12.10.0` → `^13.0.3`).
  - Upgraded `chalk` (`5.6.2` → `^6.0.0`).
  - Added backend `package-lock.json`.
- **Frontend Dependencies (`frontend/package.json`, `frontend/yarn.lock`, `frontend/package-lock.json`)**:
  - Upgraded `@testing-library/jest-dom` (`^6.9.1` → `^7.0.0`).
  - Added frontend `package-lock.json`.
- **Frontend Vitest Setup (`frontend/vitest-setup.js`)**:
  - Added a fallback polyfill for `window.localStorage` to ensure reliable test execution across Vitest runner environments.
- **Docker Build Fix (`docker/Dockerfile`)**:
  - Installed `build-essential` and `python3-dev` build tooling temporarily around `yarn install` so `node-gyp` can compile native C/C++ addons (e.g. `better-sqlite3` 13.0.3) without adding unnece[...]
- **Repository & Tooling (`.gitignore`, `package-lock.json`)**:
  - Added `.gemini`, `GEMINI.md`, and `graphify-out` to `.gitignore`.
  - Added root `package-lock.json`.

---

## Commit `fe4fa83e` - `fix(certbot): support pipx inject in plugin installer`

- **Certbot Plugin Installer (`backend/lib/certbot.js`)**:
  - Fixed a startup crash (`/opt/certbot/bin/activate: No such file`) when Nginx Proxy Manager initializes or installs DNS plugins (e.g. Cloudflare).
  - Added dynamic detection for Python virtual environments: uses `pipx inject certbot` when Certbot is installed via `pipx` (`/opt/pipx`), falling back to legacy `/opt/certbot/bin/activate` if p[...]

---

## Commit `9ef02445` - `feat: rebuild from official upstream sources, fix CVEs, and update docker hub endpoint`

### 🛡️ Security & CVE Remediation
- **Base OS (`debian:trixie-slim`)**: Replaced the custom, opaque `nginxproxymanager/nginx-full` base image with official `debian:trixie-slim` (Debian 13) for full transparency, auditability, and[...]
- **NGINX 1.30.4+ (Stable Channel)**: Installed NGINX 1.30.4 from official `nginx.org/packages/debian` repository, resolving all 8 NGINX CVEs (including **CVE-2026-42945**).
- **Apache HTTP Server / `apache2-utils`**: Pinned `apache2-utils` to `2.4.68-1~deb13u1` resolving the **HTTP/2 Bomb (CVE-2026-49975)**.
- **OpenSSL**: Upgraded system `openssl` & `libssl3t64` to `3.5.6-1~deb13u2`.
- **libssh2**: Upgraded `libssh2-1t64` to `1.11.1-1+deb13u1`.
- **NPM `undici` Dependency**: Added Yarn resolution (`undici >= 6.27.0`) in `backend/package.json`, upgrading `undici` to **8.10.0** in `backend/yarn.lock` to fix transitive vulnerability.
- **NGINX `map` Directive Audit**: Verified all `map` blocks use static literal mappings (no unnamed regex captures), confirming non-susceptibility to **CVE-2026-42533**.
- **BEAST Attack Mitigation**: Verified default SSL configuration enforces `TLSv1.2` and `TLSv1.3`, rendering **CVE-2011-3389** non-impactful.

### 🏗️ Architecture & Base Image Modernization
- **Node.js 22 LTS**: Switched runtime to official Node.js 22 LTS via NodeSource repository (`setup_22.x`).
- **Certbot via `pipx`**: Installed Certbot into an isolated `pipx` environment (`/opt/pipx`), avoiding system Python package pollution.
- **s6-overlay Supervisor**: Updated process supervisor installer (`docker/scripts/install-s6`) to **v3.2.3.2** (latest stable release).
- **CoreDNS Replacement**: Replaced `jc21/dnsrouter` test sidecar in `docker-compose.ci.yml` and `docker-compose.dev.yml` with official CNCF `coredns/coredns:latest` and created `docker/dev/Coref[...]
- **MariaDB Image Update**: Replaced `jc21/mariadb-aria` image in CI/Dev compose files with official `mariadb:lts`.
- **System Tooling**: Added `xz-utils` to base container prerequisites for `.tar.xz` archive extraction.

### 🚀 CI/CD & Automation
- **GitHub Actions Workflow**: Created `.github/workflows/build-and-publish.yml` with:
  - Multi-stage pipeline (Build Frontend → Lint Backend → Multi-Arch Image Build & Push → Version Verification).
  - Multi-architecture Docker builds (`linux/amd64` and `linux/arm64`).
  - Automated weekly cron rebuild (`0 3 * * 1`) to pick up Debian trixie and NodeSource security patches automatically.
- **CI Test Runner Optimization**: Swapped 2GB custom test images in `scripts/ci/test-and-build` and `scripts/ci/frontend-build` to lightweight `node:22-bookworm-slim`.
- **Obsolete Flags Removed**: Removed deprecated `NODE_OPTIONS="--openssl-legacy-provider"` from Dockerfiles and CI scripts.

### 🏷️ Branding & Configuration Fixes
- **Docker Hub Endpoint & Labels**: Re-branded Docker image labels, documentation, and metadata to `teoks/nginx-proxy-manager`.
- **Website & Author Information**: Updated package.json author details and UI footer links to `teoks <hello@altvirt.com>` and `altvirt.com`.
- **SQLite Test DB Config**: Corrected invalid migration paths (`src/backend/...` → `migrations`) in `backend/config/sqlite-test-db.json`.
- **s6 Ownership Script Fix**: Fixed `30-ownership.sh` script to check path existence before changing permissions, removing stale `/etc/nginx/nginx` and `/opt/certbot` path failures.
