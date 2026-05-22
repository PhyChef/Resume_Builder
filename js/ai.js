// ── API KEY MANAGEMENT ──
function getApiKey() {
  return document.getElementById('apiKeyInput').value.trim();
}

function checkApiKey() {
  const key = getApiKey();
  const dot = document.getElementById('apiDot');
  const label = document.getElementById('apiLabel');
  if (key.startsWith('sk-ant-')) {
    dot.classList.add('connected');
    label.textContent = 'Connected';
  } else {
    dot.classList.remove('connected');
    label.textContent = 'No API key';
  }
}

function showApiNotice(containerId) {
  const key = getApiKey();
  const notice = document.getElementById(containerId);
  if (!notice) return;
  if (!key || !key.startsWith('sk-ant-')) {
    notice.classList.add('visible');
  } else {
    notice.classList.remove('visible');
  }
}

// ── CLAUDE API CALL ──
async function callClaude(systemPrompt, userPrompt) {
  const key = getApiKey();
  if (!key || !key.startsWith('sk-ant-')) {
    throw new Error('NO_API_KEY');
  }
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${res.status}`);
  }
  const data = await res.json();
  return data.content.find(b => b.type === 'text')?.text || '';
}

// ── COVER LETTER ──
async function generateCoverLetter() {
  showApiNotice('clNotice');
  const key = getApiKey();
  if (!key || !key.startsWith('sk-ant-')) return;

  const jobPosting = document.getElementById('clJobPosting').value.trim();
  const tone = document.getElementById('clTone').value;
  const resumeSummary = getResumeSummary();

  if (!jobPosting) {
    alert('Please paste the job posting first.');
    return;
  }
  if (!val('fullName')) {
    alert('Please fill in your name in the Resume Builder first.');
    return;
  }

  const resultEl = document.getElementById('clResult');
  const bodyEl = document.getElementById('clResultBody');
  const loadingEl = document.getElementById('clLoading');

  loadingEl.classList.add('active');
  resultEl.classList.remove('visible');
  bodyEl.textContent = '';

  const system = `You are an expert hospitality executive resume writer with 20+ years placing senior F&B and hotel leadership talent across APAC and Europe. You write cover letters that are direct, specific, and compelling — never generic. You write in a ${tone} tone. You never use clichés like "I am passionate about" or "I believe I am the perfect candidate". Every paragraph must earn its place. Format: no subject line, no header, just the body text of the letter, starting with a sharp opening line that immediately establishes credibility and fit.`;

  const prompt = `Write a cover letter for this candidate applying to this role.

CANDIDATE PROFILE:
${resumeSummary}

JOB POSTING:
${jobPosting}

Requirements:
- 3 tight paragraphs, no more
- Opening: establish credibility and direct relevance immediately
- Middle: 2–3 specific achievements from their experience that directly address what the job needs
- Close: clear, confident call to action — no grovelling
- Tone: ${tone}
- Do NOT use bullet points
- Do NOT repeat the job title verbatim in every sentence
- Maximum 280 words`;

  try {
    const result = await callClaude(system, prompt);
    bodyEl.textContent = result;
    resultEl.classList.add('visible');
  } catch (err) {
    if (err.message === 'NO_API_KEY') {
      showApiNotice('clNotice');
    } else {
      bodyEl.textContent = 'Error: ' + err.message;
      resultEl.classList.add('visible');
    }
  } finally {
    loadingEl.classList.remove('active');
  }
}

function copyCoverLetter() {
  const text = document.getElementById('clResultBody').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('clCopyBtn');
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy text', 2000);
  });
}

// ── ATS SCORER ──
async function runATSCheck() {
  showApiNotice('atsNotice');
  const key = getApiKey();
  if (!key || !key.startsWith('sk-ant-')) return;

  const jobPosting = document.getElementById('atsJobPosting').value.trim();
  const resumeSummary = getResumeSummary();

  if (!jobPosting) {
    alert('Please paste the job posting to check against.');
    return;
  }
  if (!val('fullName')) {
    alert('Please fill in your resume in the Resume Builder first.');
    return;
  }

  const resultEl = document.getElementById('atsResult');
  const loadingEl = document.getElementById('atsLoading');

  loadingEl.classList.add('active');
  resultEl.classList.remove('visible');

  const system = `You are an ATS (Applicant Tracking System) and senior recruiter expert. You analyze resumes against job postings with precision. You always respond in valid JSON only, no markdown, no commentary outside the JSON.`;

  const prompt = `Analyze this resume against this job posting and return a JSON object with exactly this structure:

{
  "score": <integer 0-100>,
  "verdict": "<2-3 sentence plain-English summary of fit — be direct, no fluff>",
  "matched_keywords": ["keyword1", "keyword2", ...],
  "missing_keywords": ["keyword1", "keyword2", ...],
  "improvements": ["specific actionable fix 1", "specific actionable fix 2", "specific actionable fix 3"]
}

RESUME:
${resumeSummary}

JOB POSTING:
${jobPosting}

Scoring guide:
- 80-100: Strong match, likely to pass ATS and get interview
- 60-79: Moderate match, some gaps
- 40-59: Weak match, significant gaps
- Below 40: Poor match

Be honest. Do not inflate scores. Extract real keywords from the job posting, not generic ones.`;

  try {
    const raw = await callClaude(system, prompt);
    const clean = raw.replace(/```json|```/g, '').trim();
    const data = JSON.parse(clean);
    renderATSResult(data);
    resultEl.classList.add('visible');
  } catch (err) {
    if (err.message === 'NO_API_KEY') {
      showApiNotice('atsNotice');
    } else {
      document.getElementById('atsResultBody').textContent = 'Error: ' + err.message;
      resultEl.classList.add('visible');
    }
  } finally {
    loadingEl.classList.remove('active');
  }
}

function renderATSResult(data) {
  const score = Math.min(100, Math.max(0, data.score || 0));
  const color = score >= 75 ? '#1a6b3a' : score >= 50 ? '#b7770d' : '#c0392b';
  const circumference = 2 * Math.PI * 36;
  const offset = circumference * (1 - score / 100);

  const matched = (data.matched_keywords || []).map(k => `<span class="kw-match">${k}</span>`).join('');
  const missing = (data.missing_keywords || []).map(k => `<span class="kw-miss">${k}</span>`).join('');
  const improvements = (data.improvements || []).map(i => `<li style="font-size:13px;margin-bottom:8px;line-height:1.5">${i}</li>`).join('');

  document.getElementById('atsResultBody').innerHTML = `
    <div class="ats-score-wrap">
      <div class="ats-score-ring">
        <svg width="90" height="90" viewBox="0 0 90 90">
          <circle class="ring-bg" cx="45" cy="45" r="36"/>
          <circle class="ring-fill" cx="45" cy="45" r="36"
            stroke="${color}"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${offset}"/>
        </svg>
        <div class="ats-score-num">${score}<span>/ 100</span></div>
      </div>
      <div class="ats-verdict"><strong>${score >= 75 ? 'Strong match' : score >= 50 ? 'Moderate match' : 'Weak match'}</strong><br>${data.verdict || ''}</div>
    </div>

    ${matched ? `<span class="kw-label">Keywords found in your resume</span><div class="ats-keywords">${matched}</div>` : ''}
    ${missing ? `<span class="kw-label">Keywords missing — add these</span><div class="ats-keywords">${missing}</div>` : ''}

    ${improvements ? `
      <span class="kw-label" style="margin-top:20px">How to improve your score</span>
      <ol style="padding-left:18px;margin-top:8px">${improvements}</ol>
    ` : ''}
  `;
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('apiKeyInput').addEventListener('input', checkApiKey);
  checkApiKey();
});
