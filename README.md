# ClaimSight — AI-Assisted Insurance Claims Triage

A browser-based prototype that helps claims officers instantly triage incoming motor insurance claims. Enter a claim summary to receive a priority level (Low / High / Critical), confidence score, fraud indicators, risk dimension analysis, recommended next actions, and escalation recommendation — no server, no API keys, no build step required.

## Features

- **Priority triage** — classifies claims as Low, High, or Critical based on claim content
- **Confidence score** — displays an AI-style confidence percentage alongside each result
- **Fraud indicators** — surfaces specific red flags when suspicious patterns are detected
- **Risk dimensions** — animated visual bars for Financial Risk, Injury Severity, Fraud Likelihood, and Documentation Quality
- **Recommended next actions** — prioritised action list tailored to the claim's risk level
- **Escalation recommendation** — clear Yes/No decision with a written rationale
- **"Why this priority?" explanation** — transparent reasoning behind every triage decision
- **Auto-generated Claim ID and timestamp** — makes each result traceable and shareable
- **Print-friendly** — results card prints cleanly for handoff or filing

## Getting Started

No installation or build step needed.

1. Clone or download the repository
2. Open `index.html` in any modern browser

```bash
git clone https://github.com/your-username/claimsight.git
cd claimsight
open index.html   # macOS
# or double-click index.html on Windows/Linux
```

## Usage

1. Click one of the **Load sample** buttons to fill in a pre-written claim scenario, or type your own claim summary into the text area
2. Click **Analyse Claim**
3. Review the triage result card — priority, risk dimensions, fraud indicators, next actions, and escalation recommendation are all returned within seconds

### Sample scenarios included

| Sample | Priority | Key signals |
|---|---|---|
| Routine Claim | 🟢 Low | Minor rear-end collision, no injuries, clean history |
| Urgent Claim | 🟠 High | Multi-vehicle crash, hospitalisation, total loss |
| Fraud Risk | 🔴 Critical | Inconsistent timeline, prior total loss, linked repair shop, late witness |

## Project Structure

```
claimsight/
├── index.html   # Page structure and layout
├── style.css    # Styling, colour-coded priority system, animated risk bars
└── app.js       # Triage engine, mock scenarios, keyword classifier, UI logic
```

## Disclaimer

This is a demonstration prototype built for hackathon purposes. It uses hardcoded mock scenarios and keyword-based classification — it is not connected to any real insurance system or AI model, and is not intended for production use.
