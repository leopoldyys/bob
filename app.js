/* ══════════════════════════════════════════════════════════════
   ClaimSight — app.js
   Triage engine, mock scenarios, and UI logic.
   No external dependencies. Vanilla JS only.
   ══════════════════════════════════════════════════════════════ */

'use strict';

/* ── 1. Sample claim texts (quick-fill payloads) ──────────── */

const SAMPLE_TEXTS = {

  routine: `Claimant: Sarah Lim, Policy #MV-4821-09
Date of incident: 12 Nov 2024, approximately 08:45 AM

Summary:
The claimant was stationary at a red light on Buona Vista Road when her vehicle (Toyota Vios, plate SJK 4490B) was rear-ended by a Toyota Camry (plate SKB 2201H) travelling at low speed. No injuries were reported by either party. Both drivers remained at the scene, exchanged details cooperatively, and a police report was filed (Report No. NP-2024-44817).

The claimant has a clean five-year claims history with no previous incidents. The repair estimate from an approved workshop is S$1,780 covering rear bumper replacement and minor bodywork. The other party's insurer has been notified. All supporting documents (photographs, police report, workshop estimate) have been submitted with the claim.

Claimant requests a standard processing timeline.`,

  urgent: `Claimant: Marcus Tan, Policy #MV-9034-22
Date of incident: 18 Nov 2024, approximately 06:20 AM

Summary:
A multi-vehicle highway collision occurred on the PIE (Pan-Island Expressway) near exit 32. The claimant's vehicle (Honda Civic, plate SGX 8812K) was involved in a chain collision involving four vehicles during morning peak hour. The claimant sustained multiple fractures to the left leg and two broken ribs and was transported by ambulance to Tan Tock Seng Hospital, where he is currently receiving inpatient care. Projected recovery and inability to work: minimum 8 weeks.

The claimant's vehicle has been assessed as a total loss (pre-accident market value S$62,000). Third-party liability is disputed: a lorry driver (Lian Huat Transport, plate GBE 5531T) is alleged to have caused the initial impact but denies fault. A second independent witness account is pending.

Medical documentation, hospitalisation records, and total loss assessment report are partially submitted. Liability has not yet been established.`,

  fraud: `Claimant: Kevin Ong, Policy #MV-1156-17
Date of incident: 09 Nov 2024 (reported 11 Nov 2024)

Summary:
The claimant reports that his vehicle (BMW 3-Series, plate SLK 7731P) was stolen from the basement carpark of his condominium overnight between 9–10 Nov 2024. He states CCTV footage from the carpark is unavailable for that specific 4-hour window due to a "system maintenance period" — a period that conveniently aligns with the reported theft window. The condominium management office has not confirmed any scheduled maintenance.

A new witness came forward three days after the claimant's initial police report, claiming to have seen two men near the vehicle — this witness was not mentioned in the original statement.

A database check reveals the same vehicle (plate SLK 7731P) was previously declared a total loss following a flood claim in May 2022 and was subsequently reinstated to the road after a reported restoration. The claimant received a full payout at that time.

The preferred repair shop listed by the claimant, AutoFix Workshop (Toa Payoh), has been linked to four other flagged claims processed by our SIU this calendar year. Inconsistent details in the timeline raise significant concerns.`

};

/* ── 2. Mock scenario objects ─────────────────────────────── */

const SCENARIOS = {

  routine: {
    id: 'routine',
    priority: 'Low',
    priorityClass: 'priority-low',
    confidence: 91,
    rationale: 'Claim presents no indicators of fraud or serious injury. Both parties were cooperative and all supporting documents are in order. Standard documentation and inspection procedures apply.',
    riskDimensions: [
      { label: 'Financial Risk',          score: 15,  isQuality: false },
      { label: 'Injury Severity',         score: 0,   isQuality: false },
      { label: 'Fraud Likelihood',        score: 8,   isQuality: false },
      { label: 'Documentation Quality',   score: 85,  isQuality: true  }
    ],
    fraudIndicators: [],
    nextActions: [
      'Verify submitted documents against police report (No. NP-2024-44817)',
      'Schedule vehicle inspection with an approved assessor',
      'Assign to standard processing queue (SLA: 5–7 business days)',
      'Notify claimant of expected processing timeline via SMS/email'
    ],
    escalate: false,
    escalationReason: 'No escalation required. Claim meets criteria for standard processing.'
  },

  urgent: {
    id: 'urgent',
    priority: 'High',
    priorityClass: 'priority-high',
    confidence: 88,
    rationale: 'Claimant has sustained serious physical injuries and the vehicle is a confirmed total loss. Immediate adjuster assignment and medical liaison are required to prevent further harm or liability exposure.',
    riskDimensions: [
      { label: 'Financial Risk',          score: 75,  isQuality: false },
      { label: 'Injury Severity',         score: 90,  isQuality: false },
      { label: 'Fraud Likelihood',        score: 12,  isQuality: false },
      { label: 'Documentation Quality',   score: 60,  isQuality: true  }
    ],
    fraudIndicators: [],
    nextActions: [
      'Contact claimant or designated next-of-kin within 2 hours',
      'Assign immediately to a senior adjuster with personal injury experience',
      'Initiate medical liaison service and rehabilitation referral',
      'Fast-track total loss vehicle valuation (target: 48 hours)',
      'Review third-party liability exposure and initiate inter-insurer correspondence'
    ],
    escalate: true,
    escalationReason: 'Serious bodily injury (multiple fractures, hospitalisation) combined with a total vehicle loss and disputed third-party liability requires senior adjuster oversight and potential legal review.'
  },

  fraud: {
    id: 'fraud',
    priority: 'Critical',
    priorityClass: 'priority-critical',
    confidence: 94,
    rationale: 'Multiple overlapping fraud indicators have been identified, including a prior total loss on the same vehicle, a late-emerging witness, an unexplained CCTV gap, and a repair shop with a documented pattern of flagged claims. Payout must be frozen pending a full SIU investigation.',
    riskDimensions: [
      { label: 'Financial Risk',          score: 65,  isQuality: false },
      { label: 'Injury Severity',         score: 10,  isQuality: false },
      { label: 'Fraud Likelihood',        score: 95,  isQuality: false },
      { label: 'Documentation Quality',   score: 20,  isQuality: true  }
    ],
    fraudIndicators: [
      'Inconsistent timeline: CCTV outage window aligns precisely with the reported theft period — management has not confirmed scheduled maintenance',
      'New witness introduced 3 days after the initial police statement — no mention in original report',
      'Same vehicle (SLK 7731P) previously declared total loss (May 2022) and subsequently reinstated — prior full payout received',
      'Named repair shop (AutoFix Workshop, Toa Payoh) linked to 4 prior SIU-flagged claims in the current calendar year'
    ],
    nextActions: [
      'Freeze all claim payouts immediately pending investigation',
      'Refer to Special Investigations Unit (SIU) — mandatory referral threshold met',
      'Request full documentation audit and independent timeline reconstruction',
      'Preserve and formally request all CCTV records and condo management logs',
      'Obtain sworn witness statements from all parties, including the new witness',
      'Notify compliance officer and flag repair shop for pattern review'
    ],
    escalate: true,
    escalationReason: 'Four concurrent fraud indicators meet the mandatory SIU referral threshold. Senior management notification required per Anti-Fraud Policy §4.2.'
  }

};

/* ── 3. Keyword classifier ────────────────────────────────── */

const FRAUD_KEYWORDS   = ['inconsistent', 'witness', 'previously', 'staged', 'backdated', 'linked repair', 'reinstated', 'cctv', 'flagged claims', 'siu'];
const URGENT_KEYWORDS  = ['hospitalised', 'hospitalized', 'surgery', 'intensive care', 'icu', 'fatality', 'fractures', 'total loss', 'multi-vehicle', 'ambulance', 'inpatient'];

/**
 * Classify a claim summary text into a scenario id.
 * Fraud check runs first — a text containing both fraud and urgent keywords
 * will correctly resolve to the fraud scenario.
 * @param {string} text
 * @returns {'routine'|'urgent'|'fraud'}
 */
function classifyInput(text) {
  const lower = text.toLowerCase();
  if (FRAUD_KEYWORDS.some(kw  => lower.includes(kw))) return 'fraud';
  if (URGENT_KEYWORDS.some(kw => lower.includes(kw))) return 'urgent';
  return 'routine';
}

/* ── 4. Utility helpers ───────────────────────────────────── */

/**
 * Generate a demo claim ID like CLM-2024-04821.
 * @returns {string}
 */
function generateClaimId() {
  const year  = new Date().getFullYear();
  const seq   = String(Math.floor(Math.random() * 90000) + 10000);
  return `CLM-${year}-${seq}`;
}

/**
 * Format current date/time as a human-readable string.
 * @returns {string}
 */
function formatTimestamp() {
  return new Date().toLocaleString('en-GB', {
    day:    '2-digit',
    month:  'short',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit'
  });
}

/**
 * Return a bar colour class for a risk score (0–100).
 * @param {number}  score
 * @param {boolean} isQuality  - If true, scoring is inverted (high = good = green)
 * @returns {string}
 */
function barColourClass(score, isQuality) {
  if (isQuality) {
    if (score >= 70) return 'bar-quality-high';
    if (score >= 40) return 'bar-quality-medium';
    return 'bar-quality-low';
  }
  if (score < 30)  return 'bar-low';
  if (score < 65)  return 'bar-medium';
  return 'bar-high';
}

/* ── 5. DOM references ────────────────────────────────────── */

const form           = document.getElementById('triage-form');
const textarea       = document.getElementById('claim-input');
const submitBtn      = document.getElementById('submit-btn');
const validationMsg  = document.getElementById('validation-msg');
const resultsSection = document.getElementById('results-section');

const elClaimId      = document.getElementById('result-claim-id');
const elTimestamp    = document.getElementById('result-timestamp');
const elPriority     = document.getElementById('result-priority');
const elConfidence   = document.getElementById('result-confidence');
const elRationale    = document.getElementById('result-rationale');
const elBarsContainer= document.getElementById('risk-bars-container');
const elFraudBlock   = document.getElementById('fraud-block');
const elFraudList    = document.getElementById('result-fraud-list');
const elActionsList  = document.getElementById('result-actions-list');
const elEscalBlock   = document.getElementById('escalation-block');
const elEscalBadge   = document.getElementById('escalation-badge');
const elEscalReason  = document.getElementById('escalation-reason');

/* ── 6. Clear previous result ─────────────────────────────── */

function clearResult() {
  /* Remove priority classes */
  elPriority.classList.remove('priority-low', 'priority-high', 'priority-critical');

  /* Remove escalation classes */
  elEscalBlock.classList.remove('escalate-yes', 'escalate-no');

  /* Remove fraud-flagged highlight */
  elFraudBlock.classList.remove('fraud-flagged');

  /* Reset bar fills to 0 width so the transition plays on next render */
  elBarsContainer.querySelectorAll('.bar-fill').forEach(fill => {
    fill.style.width = '0%';
    fill.className = 'bar-fill'; /* strip colour class */
  });
}

/* ── 7. Render result ─────────────────────────────────────── */

function renderResult(result) {
  clearResult();

  /* Metadata */
  elClaimId.textContent   = result.claimId;
  elTimestamp.textContent = result.timestamp;

  /* Priority badge */
  elPriority.textContent = result.priority;
  elPriority.classList.add(result.priorityClass);

  /* Confidence */
  elConfidence.textContent = `${result.confidence}% confidence`;

  /* Rationale */
  elRationale.textContent = result.rationale;

  /* Risk dimension bars */
  elBarsContainer.innerHTML = '';
  result.riskDimensions.forEach(dim => {
    const row = document.createElement('div');
    row.className = 'bar-row';

    const label = document.createElement('span');
    label.className = 'bar-label';
    label.textContent = dim.label;

    const track = document.createElement('div');
    track.className = 'bar-track';

    const fill = document.createElement('div');
    fill.className = 'bar-fill'; /* colour class added after transition trigger */
    fill.style.width = '0%';

    track.appendChild(fill);

    const scoreEl = document.createElement('span');
    scoreEl.className = 'bar-score';
    scoreEl.textContent = dim.score;

    row.appendChild(label);
    row.appendChild(track);
    row.appendChild(scoreEl);
    elBarsContainer.appendChild(row);

    /* Trigger CSS transition: set actual width on next paint */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fill.classList.add(barColourClass(dim.score, dim.isQuality));
        fill.style.width = dim.score + '%';
      });
    });
  });

  /* Fraud indicators */
  elFraudList.innerHTML = '';
  if (result.fraudIndicators.length > 0) {
    elFraudBlock.classList.add('fraud-flagged');
    result.fraudIndicators.forEach(indicator => {
      const li = document.createElement('li');
      li.textContent = indicator;
      elFraudList.appendChild(li);
    });
  } else {
    const p = document.createElement('p');
    p.className = 'no-indicators';
    p.textContent = 'None identified.';
    elFraudList.appendChild(p);
  }

  /* Next actions */
  elActionsList.innerHTML = '';
  result.nextActions.forEach(action => {
    const li = document.createElement('li');
    li.textContent = action;
    elActionsList.appendChild(li);
  });

  /* Escalation */
  elEscalBlock.classList.add(result.escalate ? 'escalate-yes' : 'escalate-no');
  elEscalBadge.textContent = result.escalate ? 'ESCALATE — YES' : 'NO ESCALATION';
  elEscalReason.textContent = result.escalationReason;

  /* Reveal results card */
  resultsSection.classList.add('visible');

  /* Smooth scroll to results */
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── 8. Analyse ───────────────────────────────────────────── */

function analyse() {
  const text = textarea.value.trim();
  const scenarioId = classifyInput(text);

  /* Clone scenario object so we don't mutate the original */
  const result = Object.assign({}, SCENARIOS[scenarioId]);
  result.claimId   = generateClaimId();
  result.timestamp = formatTimestamp();

  renderResult(result);

  /* Restore button */
  submitBtn.classList.remove('loading');
  submitBtn.disabled = false;
}

/* ── 9. Handle submit ─────────────────────────────────────── */

function handleSubmit(e) {
  e.preventDefault();

  const text = textarea.value.trim();

  /* Validation */
  if (!text) {
    validationMsg.textContent = 'Please enter a claim summary before analysing.';
    textarea.focus();
    return;
  }

  validationMsg.textContent = '';

  /* Loading state */
  submitBtn.disabled = true;
  submitBtn.classList.add('loading');

  /* Simulate AI processing delay (900–1300ms) */
  const delay = 900 + Math.floor(Math.random() * 400);
  setTimeout(analyse, delay);
}

/* ── 10. Tab / page routing ───────────────────────────────── */

/**
 * Show the panel matching `pageId`, hide all others,
 * update the active nav item, and close the mobile sidebar.
 */
function navigateTo(pageId) {
  /* Hide all page panels */
  document.querySelectorAll('.page-panel').forEach(panel => {
    panel.hidden = true;
    panel.style.display = 'none';
  });

  /* Show target panel */
  const target = document.getElementById('page-' + pageId);
  if (target) {
    target.hidden = false;
    target.style.display = 'flex';
  }

  /* Update active nav item */
  document.querySelectorAll('.nav-item').forEach(item => {
    const isActive = item.dataset.page === pageId;
    item.classList.toggle('nav-item--active', isActive);
    if (isActive) {
      item.setAttribute('aria-current', 'page');
    } else {
      item.removeAttribute('aria-current');
    }
  });

  /* Scroll main content to top */
  const mainContent = document.getElementById('main-content');
  if (mainContent) mainContent.scrollTop = 0;
  window.scrollTo(0, 0);
}

/* ── 11. Event listeners ──────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  /* Initialise — enforce correct panel visibility on load */
  navigateTo('new-triage');

  /* Form submit */
  form.addEventListener('submit', handleSubmit);

  /* Quick-fill buttons */
  document.querySelectorAll('.btn-sample').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.sample;
      if (SAMPLE_TEXTS[key]) {
        textarea.value = SAMPLE_TEXTS[key];
        /* Hide any previous results when loading a new sample */
        resultsSection.classList.remove('visible');
        validationMsg.textContent = '';
        textarea.focus();
      }
    });
  });

  /* Clear validation message when user starts typing */
  textarea.addEventListener('input', () => {
    if (validationMsg.textContent) {
      validationMsg.textContent = '';
    }
  });

  /* ── Nav item routing ── */
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const pageId = item.dataset.page;
      navigateTo(pageId);
      /* Close sidebar on mobile after navigation */
      if (window.innerWidth <= 768) {
        closeSidebar();
      }
    });
  });

  /* ── Mobile sidebar toggle ── */
  const sidebarToggle  = document.getElementById('sidebar-toggle');
  const sidebar        = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');

  function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('open');
    sidebarToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('open');
    sidebarToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
  }

  /* Close sidebar on Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
      closeSidebar();
      sidebarToggle.focus();
    }
  });

});
