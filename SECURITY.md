# Security & Privacy at DeFi Tax Platform

## 1. Privacy-First Architecture (The Non-Negotiable)

This platform operates on a **Zero-Knowledge Architecture** relative to the developer. We do not want your data. We do not need your data.

### 1.1 No Server-Side Storage
*   **Local-Only:** All transaction data is stored exclusively in your browser's **IndexedDB**.
*   **No Cloud Sync:** There is no "Sync to Cloud" button. If you clear your browser cache, your data is gone. This is a feature, not a bug.
*   **Air-Gapped Logic:** The tax calculation engine (`lib/tax/calculator.ts`) is a pure function running entirely within your browser's JavaScript sandbox. It makes no network calls.

### 1.2 No External APIs
*   We do not use CoinGecko/CoinMarketCap APIs for historical pricing to avoid leaking your asset ownership information via IP address correlation.
*   You must provide prices (via CSV or manual entry), ensuring we never "phone home" with your portfolio details.

### 1.3 Auditability
*   **Open Source-ish:** The code is unminified in development mode. You can inspect `db.ts` to verify where data is written.
*   **Transparent Logic:** The `Reasoning Engine` exposes exactly *why* a tax rule was applied.

---

## 2. Browser Security

### 2.1 Content Security Policy (CSP)
We adhere to strict CSP principles:
*   `script-src`: 'self' only (plus Next.js required scripts). No third-party trackers.
*   `connect-src`: 'self' only. No external analytics.

### 2.2 Input Sanitization
*   **Strict Validation:** All inputs (CSV imports, manual forms) are passed through a Zod schema (`lib/validation.ts`).
*   **No `eval()`:** We never use dynamic code execution.
*   **No HTML Injection:** All rendered output is escaped by React by default.

---

## 3. Vulnerability Reporting
If you find a mechanism where data leaves the browser unexpectedly, please treat this as a Critical Severity vulnerability.
