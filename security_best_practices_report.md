# Security Best Practices Report

## Executive Summary
This is a minimal monorepo baseline (Next.js frontend, NestJS API). I did not find any critical or high-severity vulnerabilities in the current code, but there are a few medium/low severity gaps that should be addressed before exposing the API/UI to the public internet. Most findings are about missing production hardening and exposure of developer tooling (Swagger).

## Medium Severity

### M-001 — Public Swagger UI Without Guard
- **Location:** `apps/api/src/main.ts:10-16`
- **Evidence:**
  - `SwaggerModule.createDocument(app, config);`
  - `SwaggerModule.setup("swagger", app, document);`
- **Impact:** If deployed publicly, Swagger exposes API metadata and endpoints, which helps attackers enumerate routes and schemas. This is an information disclosure risk that increases attack surface.
- **Fix:** Gate Swagger behind an environment check (e.g., only enable in non-production) or protect it with auth (basic auth, token, or IP allowlist).
- **Mitigation:** Restrict access at the reverse proxy/WAF to internal networks only.
- **False positive notes:** If this route is already blocked by infrastructure or only accessible on internal networks, the risk is lower.

## Low Severity

### L-001 — Missing Baseline API Hardening (Security Headers/Rate Limiting)
- **Location:** `apps/api/src/main.ts:6-18`
- **Evidence:** App is created and started without middleware for security headers, payload limits, or rate limiting.
- **Impact:** Increases exposure to common web risks (e.g., missing XSS/clickjacking protections via headers, brute-force attempts, oversized payloads).
- **Fix:** Add baseline middleware in `main.ts`, e.g., `helmet`, explicit body size limits, and rate limiting (NestJS throttler or proxy-level limits).
- **Mitigation:** If you enforce these at a reverse proxy (nginx, API gateway), note it in docs.
- **False positive notes:** If a reverse proxy already enforces these controls, the application-level gap is less critical but still worth documenting.

### L-002 — Missing Global Security Headers for Next.js
- **Location:** `apps/web/next.config.mjs:1-6`
- **Evidence:** No `headers()` configuration for CSP, `X-Content-Type-Options`, `frame-ancestors`, etc.
- **Impact:** Missing defense-in-depth for XSS/clickjacking and content-type sniffing in the web app.
- **Fix:** Add a `headers()` export to set baseline security headers. Consider a CSP if feasible.
- **Mitigation:** If a CDN or reverse proxy injects these headers, document it clearly.
- **False positive notes:** If headers are already enforced at the edge, this is a documentation/config alignment issue.

### L-003 — No Global Validation Pipe for Incoming API Data
- **Location:** `apps/api/src/main.ts:6-18`
- **Evidence:** No `ValidationPipe` is configured at bootstrap.
- **Impact:** When new endpoints are added, unvalidated input can lead to unsafe assumptions or injection risks. This is more of a preventive control for future growth.
- **Fix:** Add a global `ValidationPipe` with `whitelist: true`, `forbidNonWhitelisted: true`, and `transform: true` for DTO validation.
- **Mitigation:** Ensure each controller method validates and sanitizes input manually if you avoid global pipes.
- **False positive notes:** If you already validate inputs in each handler, this is less urgent but still a recommended baseline.

## Notes
- No user input is currently accepted by the API endpoints, so most risks are forward-looking. These are best-practice hardening items to apply before production exposure.
- Keep dependencies patched (Next.js, NestJS, and React) and monitor advisories.
