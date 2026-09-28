# ClaimSight — AI-Assisted Insurance Claims Triage

A browser-based prototype that helps insurance claims officers triage incoming motor insurance claims. Enter a claim summary to receive a priority level, confidence score, fraud indicators, animated risk dimension analysis, recommended next actions, and an escalation recommendation — with no server, no API keys, and no build step required.

## Features

### Triage engine
- **Priority classification** — routes claims to Low, High, or Critical based on keyword analysis
- **Confidence score** — AI-style percentage displayed alongside every result
- **"Why this priority?" rationale** — plain-language explanation for every decision
- **Fraud indicator detection** — surfaces named red flags when suspicious patterns are present
- **Animated risk dimension bars** — Financial Risk, Injury Severity, Fraud Likelihood, and Documentation Quality
- **Recommended next actions** — ordered action list tailored to the claim's risk level
- **Escalation recommendation** — clear Yes/No with a written rationale
- **Auto-generated Claim ID and timestamp** — every result is traceable

### Full dashboard UI
- **Sidebar navigation** — 9 pages accessible from a persistent nav panel
- **Claim Queue** — 12 mock claims with status pills and priority badges
- **Recent Cases** — triage history for the last 7 days
- **Fraud Watchlist** — 3 active fraud-flagged claims with indicator chips
- **SIU Referrals** — Special Investigations Unit referral log with outcome tracking
- **Analytics** — summary stats and horizontal bar charts for priority distribution, fraud detection rate, confidence scores, and escalation rate
- **Triage History** — full decision log with fraud flag counts
- **Account Settings** — profile fields, notification toggles, and security info
- **Help & Support** — guides and IT helpdesk contact

### Design
- Inter typeface, navy blue identity (`#0D1B2A`)
- Colour-coded priority badges (green / amber / red)
- Sticky header and sidebar, mobile-responsive with slide-in drawer
- Print-friendly — results card renders cleanly for handoff or filing

### Authentication
- `login.html` — split-panel sign-in page with hardcoded demo credentials
- One-click **Fill credentials** button for demo use
- 800 ms simulated auth delay with loading spinner

## Getting Started

No installation or build step needed.

1. Clone or download the repository
2. Open `login.html` in any modern browser to start from the sign-in page, or open `index.html` directly to skip to the dashboard

```bash
git clone https://github.com/your-username/claimsight.git
cd claimsight
open login.html   # macOS
# or double-click login.html on Windows/Linux
```

## Demo credentials

| Field    | Value            |
|----------|------------------|
| Username | `claims.officer` |
| Password | `Triage@2024`    |

## Usage

1. Sign in via `login.html` (or open `index.html` directly)
2. Click one of the **Load sample** buttons, or type your own claim summary
3. Click **Analyse Claim** — results appear after a short simulated delay
4. Navigate between pages using the sidebar

### Sample scenarios

| Sample | Priority | Key signals |
|---|---|---|
| Routine Claim | 🟢 Low | Minor rear-end collision, no injuries, clean history |
| Urgent Claim | 🟠 High | Multi-vehicle crash, hospitalisation, total loss |
| Fraud Risk | 🔴 Critical | Inconsistent timeline, prior total loss, linked repair shop, late witness |

Free-text also works — typing keywords like `hospitalised` or `inconsistent` routes to the correct scenario automatically.

## Project Structure

```
claimsight/
├── login.html   # Sign-in page (split-panel, demo credentials)
├── index.html   # Dashboard — sidebar + 9 page panels
├── style.css    # Design tokens, layout, sidebar, tables, charts, settings
└── app.js       # Triage engine, keyword classifier, page routing, UI logic
```

## Disclaimer

This is a demonstration prototype built for hackathon purposes. It uses hardcoded mock data and keyword-based classification — it is not connected to any real insurance system or AI model, and is not intended for production use.
