# Website Engineering & Optimization Audit

**Repository:** `website`  
**Audit date:** 2026-08-25  
**Scope:** Next.js 16 application, Firebase client/Admin SDK, Firestore rules, API routes, UI components, build/lint configuration, and repository-visible deployment configuration.

## Executive Summary

This is a Next.js commerce and service website for digitizing/vector work. It is a single application with public marketing/shop/quote flows and a dashboard for admins/designers. Firebase Auth and Firestore are used in the browser, while custom Firestore/bcrypt/JWT APIs and SMTP provide server-side authentication and notifications.

The largest production risks are security and workflow integrity, not visual polish:

1. JWT authentication fails open to the literal secret `change-me` when `JWT_SECRET` is absent.
2. Several server-side write/email endpoints have no authentication or authorization.
3. Registration accepts a client-provided designer role.
4. The admin users API returns complete user documents, including password hashes.
5. The current worktree does not pass production build validation and lint has 4 errors.
6. Public content is largely client-rendered and route metadata is sparse, limiting SEO and first-load performance.
7. Firestore permits anonymous creation of business records without meaningful schema, size, or abuse controls.

No live URL, production headers, browser trace, Lighthouse run, hosting account, DNS, Firebase console, Search Console, analytics property, or backup configuration was available. Therefore Core Web Vitals, real TTFB, network waterfalls, uptime, backups, and production deployment claims are marked **unverified**, not assumed. A local `npm audit --omit=dev` did provide dependency evidence and found 30 advisories.

## Current Architecture Overview

```text
Browser
  |-- Next.js App Router pages and client components
  |-- Firebase client SDK: Auth, Firestore, Storage
  |-- Custom session cookies: bcrypt + JWT APIs
  |
Next.js route handlers
  |-- Firebase Admin SDK -> Firestore
  |-- Nodemailer -> SMTP
  |-- OTP cache -> process memory
  |
Firebase
  |-- Auth
  |-- Firestore rules
  |-- Storage URLs/configuration (rules not present in repository)
```

The architecture is a pragmatic monolith, which is appropriate at this size, but it has two competing identity systems and duplicated authorization. Server handlers use the Admin SDK, which bypasses Firestore rules; browser writes are governed by rules. This makes every Admin SDK endpoint a security boundary.

## Critical Findings

| ID | Priority | Finding | Location | Impact | Complexity |
|---|---|---|---|---|---|
| SEC-01 | P0 | Missing `JWT_SECRET` uses a predictable fallback, allowing forged custom sessions in misconfigured deployments. | [proxy.ts](proxy.ts#L5), auth/admin routes | Account/dashboard compromise | Low |
| SEC-02 | P0 | Registration accepts `role: "designer"` from the request body. | [register route](app/api/auth/register/route.ts#L14-L35) | Unauthorized staff account creation | Low |
| SEC-03 | P0 | Admin users response spreads the complete Firestore document, including `password`. | [users route](app/api/admin/users/route.ts#L31-L42) | Credential-hash disclosure and privacy exposure | Low |
| OPS-01 | P0 | Production build fails generated route validation because `.next` expects deleted `app/(main)/login/page.tsx`; lint fails with 4 errors. | [tsconfig.json](tsconfig.json#L20-L26), worktree status, [Pricing.tsx](components/pricing/Pricing.tsx#L140), [firebaseAdmin.ts](lib/firebaseAdmin.ts#L31) | Cannot reliably ship | Low/Medium |
| API-01 | P1 | Blog publishing and notification/action endpoints are publicly callable. | [blog publish](app/api/blog/publish/route.ts#L5-L39), [order notify](app/api/order/notify/route.ts#L7-L105), [quote assign](app/api/quote/assign/route.ts#L4-L72), [submission action](app/api/designer/submission-action/route.ts#L44-L124) | Spam, unauthorized content/workflow changes, SSRF-like outbound fetch risk | Medium |
| AUTH-01 | P1 | Firebase Auth and custom bcrypt/JWT auth coexist with different user IDs/session semantics. | [firebase.ts](lib/firebase.ts#L171-L205), [firelogin route](app/api/auth/firelogin/route.ts#L18-L57) | Role/session divergence and hard-to-audit authorization | High |
| SEO-01 | P1 | Public blog/service pages have no route-specific metadata; blogs are client-loaded from Firestore. | [blogs page](app/(main)/blogs/page.tsx#L1-L10), [services slug](app/(main)/services/[slug]/page.tsx#L1-L57), [BlogSection.tsx](components/blog/BlogSection.tsx#L40-L75) | Weak indexing, social previews, and crawlability | Medium |
| FLOW-01 | P1 | Dashboard layout protects `/login`, while failed auth redirects to `/login`, creating a redirect/loading loop. | [dashboard layout](app/(dashboard)/layout.tsx#L6-L39), [login page](app/(dashboard)/login/page.tsx#L1-L6) | Login may be inaccessible | Low |
| DATA-01 | P1 | Anonymous Firestore creates accept orders/quotes/quote requests and order sequence records with weak validation. | [firestore.rules](firestore.rules#L28-L65) | Spam, malformed data, counter manipulation, cost growth | Medium |
| MAIL-01 | P1 | Request-controlled outbound email and remote attachment fetching lack ownership/state checks. | [submission action](app/api/designer/submission-action/route.ts#L95-L118), notification routes | Abuse, data exfiltration, email reputation damage | Medium |
| PERF-01 | P1 | Product detail pages read the entire products collection for one product and related items. | [shop slug page](app/(main)/shop/[slug]/page.tsx#L16-L30) | Avoidable Firestore reads and latency | Low/Medium |
| PERF-02 | P1 | Blog listing downloads the full collection to the browser, then filters/paginates client-side. | [BlogSection.tsx](components/blog/BlogSection.tsx#L40-L105) | Mobile bandwidth/CPU and poor crawlability | Medium |
| PERF-03 | P1 | Order numbering reads every order before the transaction. | [firebase.ts](lib/firebase.ts#L134-L156) | O(n) checkout cost and contention | Medium |

## Frontend, UX/UI, and Mobile Audit

### Confirmed

- The home page synchronously includes many animated sections; only pricing is dynamically imported. This increases initial JS/render work on mobile. See [main page](app/(main)/page.tsx#L1-L48).
- Raw `<img>` is used in product, quote, dashboard, phone/country, and marketing surfaces. Examples: [admin products](app/(dashboard)/admin/products/page.tsx#L574-L578), [free quote](app/(main)/get-free-quote/page.tsx#L747-L750). This forfeits `next/image` sizing/lazy loading in many cases.
- The mobile menu's Write a Review link points to `/about/write-a-review`; the actual route is `/write-a-review`. See [Header.tsx](components/Header.tsx#L276-L286).
- The mobile menu button has no accessible name or `aria-expanded`. See [Header.tsx](components/Header.tsx#L230-L238).
- Services and Pricing desktop dropdown triggers are non-interactive spans, excluding keyboard users. See [Header.tsx](components/Header.tsx#L82-L86) and [Header.tsx](components/Header.tsx#L145-L149).
- Login fields have placeholders but no associated labels. See [AuthLogin.tsx](components/AuthLogin.tsx#L52-L76).
- Custom dropdown semantics are incomplete: no `aria-expanded`, `aria-controls`, listbox, or option semantics. See [CustomDropdown.tsx](app/(main)/get-quote/components/CustomDropdown.tsx#L77-L112).
- FAQ answers are injected as HTML. See [WhyChooseUs.tsx](components/home/WhyChooseUs.tsx#L127-L145). The source of FAQ content must be trusted/sanitized before publishing.
- Dashboard loading copy says `Logining...`. See [dashboard layout](app/(dashboard)/layout.tsx#L29-L35).

### Not measurable from source alone

Actual horizontal overflow, tap target sizes across all pages, focus visibility, contrast ratios, animation comfort, LCP/INP/CLS, and device-specific layout defects require browser testing at representative viewport sizes. Run automated Playwright/Lighthouse checks against a deployed or locally running build.

### Recommendations

- Make login a public route group and keep dashboard authorization in the dashboard group only.
- Replace span dropdown triggers with buttons and implement roving focus/escape/outside-click behavior.
- Add explicit labels, `aria-invalid`, `aria-describedby`, and focus management for form errors/modals.
- Add `prefers-reduced-motion` handling for Framer Motion/GSAP animations.
- Reserve image dimensions and migrate stable remote/local images to `next/image`; validate every remote hostname.
- Test 320px, 375px, 768px, and 1280px viewports for overflow, sticky header/menu behavior, keyboard operation, and zoom to 200%.

## Performance Audit

### Confirmed bottlenecks

- Whole-collection product fetch in [shop slug page](app/(main)/shop/[slug]/page.tsx#L16-L30).
- Whole-collection browser blog fetch in [BlogSection.tsx](components/blog/BlogSection.tsx#L40-L61).
- Whole-collection order scan in [firebase.ts](lib/firebase.ts#L134-L145).
- Multiple raw image elements and extensive client animation, as reported by ESLint and source inspection.

### Recommendations

Use Admin SDK/server queries for product-by-slug and related products with indexed category queries. Render published blog posts on the server, query only the requested page, and add cursor pagination. Allocate order numbers from a dedicated atomic counter only; migrate existing numbers once and handle transaction retries. Add bundle analysis, image-size budgets, caching/revalidation, and a Lighthouse CI budget.

Real CWV, TTFB, FCP, CDN/cache behavior, third-party cost, and server/API latency are **unverified** without a running deployment and trace.

## Technical SEO and Content Audit

### Confirmed

- Root metadata describes a “digital art portfolio,” which does not match the service/commerce intent. See [app/layout.tsx](app/layout.tsx#L15-L18).
- Blog listing and service routes have no route metadata. See [blogs page](app/(main)/blogs/page.tsx#L1-L10) and [services slug](app/(main)/services/[slug]/page.tsx#L1-L57).
- Blog detail uses `force-dynamic`, has no `generateMetadata`, and fetches content server-side without a metadata contract. See [blog detail](app/(main)/blogs/[slug]/page.tsx#L18-L82).
- No repository-visible `robots.ts`, `sitemap.ts`, or JSON-LD/schema implementation was found.
- Checkout, cart, dashboard, login, and internal admin/designer pages should be `noindex`; public service, product, portfolio, FAQ, and published blog pages should have canonical metadata.

### Recommendations

Create route metadata from the actual business name, service locations, contact details, and page intent. Add `app/robots.ts`, `app/sitemap.ts`, canonical URLs, Open Graph/Twitter images, Organization/LocalBusiness, Service, Product, Article, BreadcrumbList, and FAQPage schema only where the visible content supports it. Server-render published blog content and define `generateMetadata` from the same query. Validate title/description uniqueness and add internal links from service pages to quote/pricing/product pages.

Keyword cannibalization, search rankings, E-E-A-T, local SEO, redirects, 404 behavior, index coverage, Search Console, and content quality are **unverified** without the live site, sitemap, Search Console, and business brief.

## Backend, API, Database, and Workflow Audit

### Confirmed API issues

- [blog publish](app/api/blog/publish/route.ts#L5-L39) writes with no admin check.
- [quote assign](app/api/quote/assign/route.ts#L4-L72), [order notify](app/api/order/notify/route.ts#L7-L105), [quote notify](app/api/quote/notify/route.ts#L1-L95), and [submission action](app/api/designer/submission-action/route.ts#L44-L124) trust request IDs/emails/actions rather than deriving authority from the authenticated actor and Firestore state.
- [submission action](app/api/designer/submission-action/route.ts#L32-L42) fetches a request-supplied URL server-side. Allow only an allowlisted storage origin and verify the file belongs to the quote.
- Public forms have basic required-field checks but no consistent Zod schema, body-size limit, field length limit, email normalization policy, rate limit, CAPTCHA/abuse control, idempotency key, or structured error contract.
- OTP is generated with `Math.random()` and stored in process memory in [send OTP](app/api/quote/send-otp/route.ts#L35-L39) and [otpCache.ts](lib/otpCache.ts#L1-L50). Use a cryptographic generator plus Redis/Firestore TTL storage, attempt limits, resend cooldown, and per-IP/email throttles.
- SMTP handlers allow relaxed TLS in fallback paths. [contact route](app/api/contact/submit/route.ts#L52-L68) and [order notify](app/api/order/notify/route.ts#L61-L94) should fail rather than silently disable certificate verification in production.
- Contact/review HTML email values are interpolated without escaping. See [contact route](app/api/contact/submit/route.ts#L72-L86). Use text-only mail or an HTML escape helper.

### Database/rules

- Firestore rules deny by default, and staff/admin checks are a useful baseline. However, `allow create: if true` for orders, quotes, and quote requests is too permissive without schema and abuse controls. See [firestore.rules](firestore.rules#L28-L65).
- The order sequence exposes a public metadata document and permits public incrementing subject to a simple numeric rule. Move sequencing server-side or use a trusted backend transaction.
- Admin SDK helpers return `[]` on initialization/query failure in [firebaseAdmin.ts](lib/firebaseAdmin.ts#L35-L51), masking outages as empty data. Throw typed operational errors and return a controlled 5xx.
- No migrations, backup, restore, retention, archive, emulator tests, or Firestore cost/index monitoring are visible in the repository. These are **unverified** operational controls.

### End-to-end workflow risks

Checkout can create an order, then call a separate notification pipeline. A refresh/retry can repeat notifications unless every side effect is idempotent. Completion emails are guarded by a timestamp, but the public endpoint can still trigger action based on a supplied `orderId`. Use a server-owned order state machine, authenticated transitions, idempotency keys, an outbox/job queue, and auditable event records.

## Security Audit

### Confirmed

- Fail-open JWT secret: [proxy.ts](proxy.ts#L5), [firelogin](app/api/auth/firelogin/route.ts#L6), admin routes, and session routes all use the same fallback pattern.
- Client-controlled role at registration: [register route](app/api/auth/register/route.ts#L14-L35).
- Password hashes returned to the admin browser: [users route](app/api/admin/users/route.ts#L31-L42).
- Admin route authorization is duplicated in middleware/layout/API code and uses different cookie parsing/verification paths. Consolidate into one server-only guard.
- Cookies do not explicitly set `secure: true` in [firelogin](app/api/auth/firelogin/route.ts#L42-L50) and admin session creation. Set `secure: true` in production, `httpOnly`, `sameSite`, `path`, expiration, and rotate/revoke strategy.
- Public side-effect endpoints lack CSRF/origin/rate-limit/auth controls. SameSite cookies reduce some CSRF exposure but do not replace server authorization.

### Potential/unverified

CORS, CSP effectiveness, dependency CVEs, Firebase Storage rules, secret exposure in CI/logs, DNS/SSL, session revocation, brute-force behavior, and production security headers require deployment/configuration inspection. No database injection path was found because Firestore is used, but untrusted strings still require validation.

### Remediation order

Fail closed on required environment variables; rotate any potentially exposed secret; remove password from all API DTOs; adopt one auth provider/session model; add shared `requireAdmin`/`requireDesigner` guards; validate input with Zod; add rate limiting and idempotency; restrict outbound URLs; add CSP, frame-ancestors/X-Frame-Options, Referrer-Policy, Permissions-Policy, HSTS, and secure cookies; add security tests.

## Code Quality and Maintainability

`npm run lint` reports **4 errors and 69 warnings**. Errors include explicit `any` in [firebaseAdmin.ts](lib/firebaseAdmin.ts#L31), synchronous state updates inside effects in [pricing Pricing.tsx](components/pricing/Pricing.tsx#L140-L143) and [ServiceTestimonials.tsx](components/services/ServiceTestimonials.tsx#L80-L84), plus one additional checkout typing error. Warnings include unused variables/imports, raw images, and effect dependency instability in [GetQuoteForm.tsx](app/(main)/get-quote/components/GetQuoteForm.tsx#L113-L149).

There is no visible test script, test directory, API contract test, Firestore emulator test, accessibility test, or E2E checkout/auth test. Add tests around authorization, registration roles, order idempotency, OTP expiry/attempts, route metadata, and critical quote/checkout workflows.

## DevOps, Deployment, Analytics, and Third Parties

- [firebase.json](firebase.json#L1-L8) configures Firestore only; hosting/rewrites/headers are not visible. Hosting target is **unverified**.
- [next.config.ts](next.config.ts#L1-L22) has remote image patterns but no security headers, CSP, cache policy, or observability configuration.
- No CI/CD, staging/prod separation, rollback, uptime alert, error tracking, performance monitoring, analytics, consent management, or conversion event implementation was found in the repository. These are **unverified** rather than proven absent from external infrastructure.
- Main dependencies include Next.js, React, Firebase, Firebase Admin, Nodemailer, JWT, bcrypt, Framer Motion, GSAP, Radix, Zod, and phone-number tooling. They are broadly justified, but duplicate animation/icon/auth patterns increase bundle and maintenance cost. `npm audit --omit=dev` reports 30 vulnerabilities, including 1 critical and 17 high; remediate with a tested lockfile update, prioritizing reachable runtime packages and reviewing the breaking changes proposed by `npm audit fix --force`. Add Dependabot and bundle analysis to CI.
- Required business events: quote_started, otp_sent, otp_verified, quote_submitted, checkout_started, order_created, payment/result if applicable, file_downloaded, contact_submitted, review_submitted, CTA clicks, and API errors. Respect consent requirements and do not send customer PII as event parameters.

## Recommended Target Architecture

1. **One identity model:** Prefer Firebase Auth for user identity, custom claims for roles, and a server-verified Firebase ID token/session cookie. Remove parallel bcrypt/JWT login, or isolate it behind a documented migration boundary.
2. **Server-owned authorization:** Central `requireAuth`, `requireAdmin`, and `requireDesigner` functions verify the session, role, resource ownership, and allowed state transition. Middleware is only an early redirect, never the sole control.
3. **Validated API layer:** Each route has a Zod input schema, bounded body size, normalized fields, consistent error codes, rate limiting, CSRF/origin protection for cookie-authenticated mutations, and request IDs.
4. **Workflow state machine:** Orders/quotes transition through explicit allowed states. Writes and notification intents are idempotent. An outbox collection plus a worker/Cloud Task sends email and retries safely.
5. **Firestore model:** Public submissions go through server APIs; clients cannot create arbitrary business documents. Use indexes for slug/category/status queries, server timestamps, ownership fields, and rules tests in the Firebase emulator.
6. **Rendering strategy:** Server-render public service/product/blog pages with metadata and revalidation. Keep interactive quote/cart/dashboard controls client-side. Use cursor pagination and optimized images.
7. **Operations:** CI runs typecheck, lint, unit/API tests, emulator rules tests, build, dependency audit, bundle/Lighthouse budgets, and migration checks. Use staging, secret validation, structured logs, error/performance monitoring, backups, and tested restore procedures.

## Prioritized Action Plan

### P0 Critical

| Problem | Recommended solution | Expected impact | Complexity |
|---|---|---|---|
| Fallback JWT secret | Require `JWT_SECRET` at startup or remove custom JWT auth; rotate secrets. | Prevent forged sessions | Low/Medium |
| Client-selected designer role | Ignore request role; create `user` only; admin promotion requires authenticated admin. | Blocks privilege creation | Low |
| Password hash exposure | Return an allowlisted DTO excluding password/hash/provider tokens. | Removes credential disclosure | Low |
| Broken build/lint | Resolve stale/deleted route conflict, remove `.next` from type scope if appropriate, fix 4 lint errors, add CI gates. | Restores deployability | Low/Medium |

### P1 High

| Problem | Recommended solution | Expected impact | Complexity |
|---|---|---|---|
| Public side-effect APIs | Shared role/resource authorization on blog, assignment, notification, and submission routes. | Stops abuse and unauthorized workflow changes | Medium |
| Anonymous Firestore business writes | Route writes through validated server APIs; tighten rules and add rate limits. | Reduces spam/cost/data corruption | Medium |
| Duplicate auth systems | Migrate to one provider/session model. | Removes role divergence | High |
| SEO/client blog rendering | Server query, pagination, `generateMetadata`, canonical/OG/schema, sitemap/robots. | Better indexability and conversion traffic | Medium |
| O(n) reads | Query by slug/category and use atomic server sequence. | Lower latency and Firestore cost | Medium |
| Public remote attachment fetch | Allowlist storage origin and verify quote/order ownership. | Reduces outbound-fetch abuse | Medium |
| Vulnerable production dependencies | Update and test the lockfile; prioritize `websocket-driver`, `next`, `nodemailer`, `sharp`, and Firebase Admin transitive chains. | Reduces known runtime exposure | Low/Medium |

### P2 Medium

- Add schema validation, body limits, typed errors, idempotency, structured logs, and request correlation to every API.
- Move OTP state to shared TTL storage; use cryptographic randomness and attempt limits.
- Escape email HTML and remove relaxed TLS fallback.
- Add image optimization, code splitting for below-fold sections, caching/revalidation, and bundle budgets.
- Complete keyboard semantics, labels, focus handling, reduced-motion support, and automated WCAG checks.
- Add Firestore emulator rules tests, API tests, and E2E auth/quote/checkout tests.

### P3 Low

- Remove unused imports/state and stale ESLint disable directives.
- Consolidate icon/animation libraries where practical.
- Correct copy such as `Logining...`, standardize URL casing, and improve empty/error states.
- Add content governance: authorship, review dates, internal links, image alt-text rules, and editorial schema.

## Quick Wins

1. Delete all secret fallbacks and make production startup fail closed.
2. Force registration role to `user`.
3. Strip `password` from admin responses.
4. Add auth checks to all Admin SDK mutation/email routes.
5. Fix `/about/write-a-review` to `/write-a-review`.
6. Move login outside the protected dashboard layout.
7. Add `secure` cookies and security headers.
8. Add root robots/sitemap and route metadata.
9. Replace full collection product/blog reads with bounded queries.
10. Fix lint errors and make build/lint required CI checks.

## Implementation Roadmap

**Phase 1, release blocker:** Fix route conflict and lint; fail closed on secrets/config; remove password exposure; disable client role escalation; protect every Admin SDK mutation; rotate secrets.

**Phase 2, trust and reliability:** Consolidate auth; add shared authorization/resource checks; validate all request bodies; add rate limits, idempotency, OTP hardening, safe outbound email, and Firestore emulator rules tests.

**Phase 3, acquisition and speed:** Server-render blogs/services/products; implement metadata, canonical URLs, robots/sitemap/schema; optimize images and client bundles; fix order/product/blog query patterns; add Lighthouse and bundle budgets.

**Phase 4, production operations:** Establish staging/production environments, CI/CD with rollback, structured logs, error/APM monitoring, uptime alerts, backups/restore drills, dependency scanning, remediate the current audit advisories, and add consent-aware analytics.

**Phase 5, quality and growth:** Complete WCAG 2.2 AA testing, E2E conversion journeys, content/internal-link program, schema validation, and measurement of quote/order funnel conversion.

## Final Scorecard

Scores reflect repository evidence only; production-observability categories are discounted where evidence is unavailable.

| Area | Score / 100 | Basis |
|---|---:|---|
| UI/UX | 66 | Broad page/component coverage, but interaction consistency and states need work |
| Mobile optimization | 55 | Dedicated mobile menu exists; raw images, navigation bug, and unverified device behavior |
| Performance | 48 | Full collection reads, client blog loading, many animations/raw images |
| Technical SEO | 38 | Sparse metadata; no visible robots/sitemap/schema |
| On-page SEO | 50 | Product metadata exists, but public content strategy/metadata is incomplete |
| Accessibility | 48 | Some labels/ARIA exist, but key nav/forms/dropdowns are incomplete |
| Frontend architecture | 62 | App Router/component structure is usable, with client/server and library duplication |
| Backend architecture | 42 | Functional route handlers, but duplicated auth and public side effects |
| Database | 50 | Default-deny rules and atomic counter intent, weakened by anonymous creates and masking errors |
| Security | 25 | P0 auth/credential/API boundary risks |
| Scalability | 44 | Firestore/serverless can scale, but whole-collection reads and memory OTP do not |
| Code quality | 52 | TypeScript structure is present; lint errors/warnings and missing tests |
| DevOps | 30 | Minimal Firebase config; CI/monitoring/backup evidence absent |
| Analytics | 20 | No repository-visible funnel/error/performance tracking |
| Overall technical health | 45 | Not production-grade until P0/P1 issues are addressed |

## Top 10 Actions First

1. Fail closed when `JWT_SECRET` or Firebase Admin credentials are missing; rotate secrets.
2. Remove client-controlled roles from registration.
3. Stop returning password hashes from admin APIs.
4. Protect every server-side mutation, email, assignment, and publish endpoint.
5. Resolve the login route/worktree conflict and make `npm run build` pass.
6. Fix all lint errors and add CI gates.
7. Consolidate Firebase/custom authentication and centralize authorization.
8. Replace anonymous unrestricted business writes with validated, rate-limited server APIs.
9. Make order/quote/email workflows stateful and idempotent.
10. Server-render SEO-critical public content and add metadata, sitemap, robots, schema, and image/query optimizations.

## Validation Commands Run

- `npm run lint`: failed, 4 errors and 69 warnings.
- `npm run build`: compiled, then failed during Next generated-route type validation because `.next/dev/types/validator.ts` references missing `app/(main)/login/page.js`.
- `npm audit --omit=dev`: failed with 30 vulnerabilities: 1 critical, 17 high, 10 moderate, and 2 low.
- `git status --short`: existing changes include deleted `app/(main)/login/page.tsx` and untracked `app/(dashboard)/login/`; these were not modified by this audit.

## Evidence Gaps

A production-grade follow-up audit still needs a deployed URL, authenticated test accounts, Lighthouse/Playwright traces on mobile and desktop, response headers, bundle report, Firebase rules/index/usage export, hosting/CDN/DNS details, CI configuration, secret-management policy, backup/restore evidence, Search Console/analytics access, and a dependency audit against the lockfile.
