# Insurance Claims Triage App — Plan

## Overview

Build a static, self-contained insurance claims triage prototype using plain HTML, CSS, and JavaScript (no framework, no build step, no external API calls). The app lets a claims officer paste or type a claim summary and instantly see a triage result. Mock responses are hardcoded in JavaScript and selected by keyword matching against the input text.

All three scenarios use **motor/vehicle insurance** for maximum relatability with non-specialist judges.

**Scope**
- 3 files: `index.html`, `style.css`, `app.js`
- 3 preloaded mock scenarios (routine, urgent, fraud-flagged)
- No server, no API keys, no build tooling

**Non-goals**
- Real LLM integration
- Backend or database
- Authentication

---

## Result Data Shape (per scenario)

```
{
  id: "routine" | "urgent" | "fraud",
  claimId: string,                    // auto-generated e.g. CLM-2024-00847
  timestamp: string,                  // current date/time at analysis
  priority: "Low" | "High" | "Critical",
  priorityClass: string,              // CSS class
  confidence: number,                 // 0–100, displayed as percentage
  rationale: string,                  // 1-2 sentence "Why this priority?" explanation
  riskDimensions: [                   // for CSS bar chart
    { label: string, score: number }  // score 0–100
  ],
  fraudIndicators: string[],
  nextActions: string[],
  escalate: boolean,
  escalationReason: string
}
```

---

## Sub-Tasks

---

### Sub-Task 1 — Project scaffold and HTML structure

**Status:** `[x] done`

**Intent**
Create the three project files with the correct skeleton. The HTML file defines the page layout: a branded header, a claim input form (textarea + quick-fill buttons), and a hidden results panel containing all result sub-sections.

**Expected Outcomes**
- `index.html` loads in a browser with no errors
- Page shows: branded header, textarea, three "Load Sample" buttons, a submit button
- Results panel exists in the DOM but is hidden initially
- Results panel contains: claim ID + timestamp bar, priority badge + confidence score, risk dimensions section (4 bars), fraud indicators list, next actions list, escalation block, rationale paragraph
- CSS and JS files are present and linked

**Todo List**
1. Create `index.html` with semantic HTML5 structure (header, main, form, results section)
2. Add a branded header: "ClaimSight" — AI-Assisted Claims Triage (tagline: "Faster decisions. Consistent assessments.")
3. Add textarea for claim summary input (placeholder: "Paste or type the claim summary here…")
4. Add three quick-fill buttons: "Sample: Routine Claim", "Sample: Urgent Claim", "Sample: Fraud Risk"
5. Add "Analyse Claim" submit button
6. Add results `<section>` with sub-elements (all hidden by default):
   - Claim metadata bar: auto-generated Claim ID + analysis timestamp
   - Priority badge (`<span>`) + confidence score (`<span>`)
   - "Why this priority?" rationale paragraph
   - Risk dimensions section: 4 labelled progress bars (Financial Risk, Injury Severity, Fraud Likelihood, Documentation Quality)
   - Fraud indicators `<ul>`
   - Recommended next actions `<ul>`
   - Escalation block with Yes/No indicator and reason text
7. Create empty `style.css` and `app.js` and link them

**Relevant Context**
- All result sub-elements need `id` attributes for `app.js` to target
- Risk dimension bars: each bar is a container `<div>` with an inner `<div>` whose width is set inline by JS

---

### Sub-Task 2 — Styling (style.css)

**Status:** `[x] done`

**Intent**
Style the app to look like a credible operational tool — professional, clean, and visually distinct enough to impress at a hackathon demo. Priority levels are colour-coded. Risk bars are animated. The layout is immediately readable.

**Expected Outcomes**
- Centred max-width container with a clean white card on a light gray background
- Branded header with a dark navy background and white text
- Textarea is comfortably sized; form section reads clearly
- Quick-fill buttons are visually secondary (outlined) vs the primary submit button (filled blue)
- Results card has a clear visual boundary (shadow, border-radius)
- Priority badge is pill-shaped with background colour:
  - `.priority-low` → green
  - `.priority-high` → amber/orange
  - `.priority-critical` → red
- Confidence score displayed inline next to priority badge, styled as a muted label
- Risk dimension bars: animated fill on reveal (CSS transition), colour shifts from green → amber → red based on score
- Fraud indicators section uses a subtle amber/yellow background when indicators are present
- Escalation block: green background when No, red background when Yes
- Rationale paragraph styled as a subtle callout box (left border accent)
- Submit button shows a loading state (spinner icon via CSS or "Analysing…" text, button disabled)
- Responsive at 1024px+ width

**Todo List**
1. Declare CSS custom properties in `:root`: colour palette (navy, primary blue, green, amber, red, grays), spacing scale, border-radius
2. Style page background, container, and layout
3. Style the branded header
4. Style textarea, quick-fill buttons, submit button (including `.loading` and `:disabled` states)
5. Style the results card (hidden by default with `display:none`, shown via `.visible` class added by JS)
6. Style claim metadata bar (small text, muted, flex row)
7. Style priority badge (pill shape, colour classes) and inline confidence label
8. Style the rationale callout box
9. Style risk dimension bars: track + fill, CSS transition for animated fill, colour utility classes (`.bar-low`, `.bar-medium`, `.bar-high`)
10. Style fraud indicators list and escalation block (conditional background colours via `.escalate-yes` / `.escalate-no` classes)
11. Add print-friendly styles (`@media print`) so the results card prints cleanly — useful for the demo

**Relevant Context**
- Bar fill width is set as inline style by JS; the CSS transition animates from 0 to that width on reveal
- Conditional colour classes (priority, escalation, bar colours) are all toggled by `app.js`

---

### Sub-Task 3 — Mock triage engine and UI logic (app.js)

**Status:** `[x] done`

**Intent**
Implement all JavaScript: mock scenario data, sample claim texts, keyword-matching triage function, and DOM rendering. The result should feel responsive and polished during a live demo.

**Expected Outcomes**
- Clicking a quick-fill button populates the textarea with the corresponding sample text
- Clicking "Analyse Claim" validates input, shows a loading state (800–1200ms simulated delay), then renders results
- Keyword matching correctly routes: fraud keywords → fraud scenario, urgency keywords → urgent scenario, default → routine
- Results card becomes visible with all fields correctly populated
- Priority badge gets the correct colour class; old classes are cleared before applying new ones
- Risk bars animate in (widths set via inline style after a short delay so the CSS transition fires)
- Fraud indicator section gets the warning background class only when indicators exist
- Escalation block gets `.escalate-yes` or `.escalate-no` class accordingly
- Submitting empty textarea shows an inline validation message (does not submit)

**Todo List**
1. Define three mock scenario objects matching the Result Data Shape above (claimId and timestamp are generated at render time, not in the static object)
2. Define sample claim text strings for quick-fill buttons (content defined in Sub-Task 4)
3. Implement `classifyInput(text)`: lowercase the input, check fraud keywords first (inconsistent, witness, previously claimed, total loss, staged, backdated, linked repair), then urgency keywords (hospitalised, surgery, intensive care, fatality, fractures, total loss, multi-vehicle), default to routine
4. Implement `generateClaimId()`: returns a string like `CLM-2024-XXXXX` with a random 5-digit number
5. Implement `handleSubmit(e)`: prevent default, validate non-empty, set button to loading state, call `setTimeout(analyse, random 800–1200ms)`
6. Implement `analyse()`: call `classifyInput`, clone the matched scenario, inject generated claimId and formatted timestamp, call `renderResult`, restore button state
7. Implement `renderResult(result)`: populate all DOM elements by id, apply CSS classes, set bar widths via inline style (use `requestAnimationFrame` or brief `setTimeout` to trigger CSS transition animation), make results section visible by adding `.visible` class
8. Implement `clearResult()`: remove old priority/escalation classes, clear bar widths to 0 before each new render
9. Wire up event listeners on DOMContentLoaded: quick-fill buttons → set textarea value + clear any existing result, form submit → `handleSubmit`

**Relevant Context**
- Risk bar animation: set width to "0%" first, then after a 50ms setTimeout set to the actual value — this lets the CSS transition play
- `clearResult()` must remove all conditional CSS classes before `renderResult` adds the new ones
- Keyword matching on "total loss" appears in both fraud and urgent keyword lists — fraud check runs first, so a fraud scenario text mentioning "total loss" correctly routes to fraud

---

### Sub-Task 4 — Mock scenario content

**Status:** `[x] done`

**Intent**
Write the three realistic motor insurance claim summaries and their corresponding triage outputs. This is the content that makes the prototype convincing during the demo.

**Expected Outcomes**
- Three claim texts read as plausible, real-world motor insurance claim descriptions
- Each triage output is internally consistent and realistic
- The fraud scenario contains clearly named red flags that match the fraud keywords in the classifier
- Risk dimension scores are consistent with the scenario severity
- Confidence scores feel realistic (not 100%)

**Todo List**
1. Write **Routine** claim text: minor rear-end collision at low speed, no injuries, both parties cooperative, police report filed, single vehicle repair estimate ~$1,800, claimant has clean 5-year history
2. Write **Urgent** claim text: multi-vehicle highway collision, claimant hospitalised with multiple fractures, vehicle total loss, third-party liability disputed, claimant unable to work for 8 weeks
3. Write **Fraud Risk** claim text: claimant reports overnight vehicle theft but CCTV footage period is conveniently unavailable; a new witness appeared three days after the initial statement; the same vehicle was previously declared a total loss 18 months ago and subsequently reinstated; the named repair shop has appeared in 4 prior flagged claims this year
4. Define triage outputs:
   - **Routine**: priority=Low, confidence=91, rationale="Claim presents no indicators of fraud or serious injury. Standard documentation and inspection procedures apply.", riskDimensions=[Financial Risk:15, Injury Severity:0, Fraud Likelihood:8, Documentation Quality:85], fraudIndicators=[], nextActions=["Verify submitted documents and police report", "Schedule vehicle inspection with approved assessor", "Assign to standard processing queue", "Notify claimant of expected 5–7 business day timeline"], escalate=false, escalationReason="No escalation required."
   - **Urgent**: priority=High, confidence=88, rationale="Claimant has sustained serious physical injuries and the vehicle is a total loss. Immediate adjuster assignment and medical liaison are required to prevent further harm or liability exposure.", riskDimensions=[Financial Risk:75, Injury Severity:90, Fraud Likelihood:12, Documentation Quality:60], fraudIndicators=[], nextActions=["Contact claimant or next-of-kin within 2 hours", "Assign to senior adjuster immediately", "Initiate medical liaison and rehabilitation referral", "Fast-track total loss vehicle valuation", "Review third-party liability exposure"], escalate=true, escalationReason="Serious bodily injury and total vehicle loss require senior adjuster oversight and potential legal review."
   - **Fraud Risk**: priority=Critical, confidence=94, rationale="Multiple overlapping fraud indicators have been identified, including a prior total loss on the same vehicle, a late-emerging witness, and a repair shop with a pattern of flagged claims. Payout must be frozen pending SIU investigation.", riskDimensions=[Financial Risk:65, Injury Severity:10, Fraud Likelihood:95, Documentation Quality:20], fraudIndicators=["Inconsistent timeline: CCTV gap aligns suspiciously with reported theft window", "New witness introduced 3 days after initial statement — not mentioned in original report", "Vehicle previously declared total loss (18 months ago) and subsequently reinstated", "Named repair shop linked to 4 prior flagged claims in the current calendar year"], nextActions=["Freeze all payouts pending investigation", "Refer immediately to Special Investigations Unit (SIU)", "Request full documentation audit and timeline reconstruction", "Preserve CCTV request records and witness statements", "Notify compliance officer"], escalate=true, escalationReason="Four concurrent fraud indicators meet the threshold for mandatory SIU referral and senior management notification."

**Relevant Context**
- Claim text strings are used both as quick-fill payloads and as the inputs the keyword classifier runs against
- Ensure fraud claim text contains the words: "previously", "total loss", "witness", "inconsistent" (or synonyms that match the classifier keywords)
- Ensure urgent claim text contains: "hospitalised", "fractures", "total loss", "multi-vehicle"

---

## File Structure

```
/
├── index.html
├── style.css
└── app.js
```

---

## Demo Flow (for judges)

1. Open `index.html` in a browser — no server needed
2. Click "Sample: Routine Claim" → "Analyse Claim" → show green Low priority result
3. Click "Sample: Urgent Claim" → "Analyse Claim" → show amber High priority with escalation
4. Click "Sample: Fraud Risk" → "Analyse Claim" → show red Critical priority with SIU actions
5. Type a custom claim (e.g. "claimant was hospitalised") → show it still works with free text
