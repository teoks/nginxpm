# Software Bill of Materials (SBOM) — nginxpm

This document describes the software inventory, dependencies, runtime environments, and base system components comprising **`nginxpm`**.

Standard machine-readable SBOM export files are available in this repository:
- **CycloneDX 1.7 JSON**: [`sbom.cdx.json`](./sbom.cdx.json)
- **SPDX 2.3 JSON**: [`sbom.spdx.json`](./sbom.spdx.json)

---

## 1. Container & Operating System Stack

| Component | Version / Specification | Source / Upstream | Purpose |
| :--- | :--- | :--- | :--- |
| **Base Operating System** | Debian 13 (`debian:trixie-slim`) | Official Docker Hub (`library/debian`) | Container root operating system |
| **Reverse Proxy Core** | NGINX `1.30.4+` | Official `nginx.org/packages/debian` | Reverse proxy and HTTP/2 engine |
| **Cryptography / TLS** | OpenSSL `3.5.6-1~deb13u2` | Debian Trixie security repository | TLS 1.2/1.3 cryptographic engine |
| **Process Supervisor** | s6-overlay `v3.2.3.2` | `just-containers/s6-overlay` | Multi-process container init supervisor |
| **Certificate Client** | Certbot via `pipx` | Python Packaging Index (`pipx`) | Automated ACME Let's Encrypt certificates |
| **JavaScript Runtime** | Node.js `22.x LTS` | NodeSource official repository | Backend execution runtime |
| **HTTP Utility** | `apache2-utils` `2.4.68-1~deb13u1` | Debian Trixie security repository | `htpasswd` basic auth generation |

---

## 2. Backend Stack & Dependencies (`backend/`)

| Package Name | Version Range | Purpose / Category |
| :--- | :--- | :--- |
| `express` | `^5.2.1` | HTTP API Web Framework |
| `knex` | `^3.3.0` | SQL Query Builder & Migration Manager |
| `better-sqlite3` | `^13.0.3` | Default embedded SQLite database |
| `mysql2` | `^3.23.4` | MySQL / MariaDB database adapter |
| `pg` | `^8.23.0` | PostgreSQL database adapter |
| `bcrypt` | `^6.0.0` | Secure password hashing |
| `otplib` | `^13.5.0` | 2FA / TOTP authentication token engine |
| `liquidjs` | `^10.29.0` | Nginx configuration templating engine |
| `express-rate-limit` | `^8.3.0` | Endpoint abuse & brute-force rate limiter |
| `body-parser` | `^2.3.0` | HTTP request body parsing middleware |
| `compression` | `^1.8.1` | HTTP payload gzip/deflate compression |
| `jsonwebtoken` | `^9.0.3` | JWT authentication & session verification |
| `proxy-agent` | `^8.0.2` | Outbound proxy client agent |
| `ajv` | `^8.20.0` | JSON Schema validation engine |

---

## 3. Frontend Stack & Dependencies (`frontend/`)

| Package Name | Version Range | Purpose / Category |
| :--- | :--- | :--- |
| `react` / `react-dom` | `^19.2.8` | Component UI Library |
| `vite` | `^8.2.2` | Modern frontend build tooling & bundler |
| `typescript` | `^7.0.2` | Type-safe static analysis |
| `@tanstack/react-table`| `^9.1.2` | High-performance headless data table engine |
| `@tanstack/react-query`| `^5.101.4` | Server state management & API caching |
| `@tabler/core` | `^1.4.0` | Dashboard UI design system & styles |
| `@tabler/icons-react` | `^3.46.0` | SVG Icon Library |
| `react-router-dom` | `^7.18.2` | Client-side routing |
| `formik` / `yup` | `^2.4.6` / `^1.7.1` | Form state management & input validation |
| `vitest` | `^4.1.11` | Unit & integration test runner |

---

## 4. Test & Verification Subsystems (`test/`)

| Tool / Dependency | Version Range | Purpose |
| :--- | :--- | :--- |
| `cypress` | `^15.21.0` | End-to-End browser API test automation |
| `@quobix/vacuum` | `^0.26.4` | OpenAPI / Swagger linting & validation |
| `mocha` | `^11.7.5` | Test reporting framework |
| `@jc21/cypress-swagger-validation` | `^0.3.2` | Response schema validation plugin |

---

## 5. SBOM Generation Command Reference

To regenerate the machine-readable SBOM artifacts at any time:

```bash
# CycloneDX format (JSON)
trivy fs --format cyclonedx --output sbom.cdx.json .

# SPDX format (JSON)
trivy fs --format spdx-json --output sbom.spdx.json .
```
