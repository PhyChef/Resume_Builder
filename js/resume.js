// ── STATE ──
const state = {
  photo: null,
  template: 'classic',
  exp: [],
  edu: [],
  expCount: 0,
  eduCount: 0
};

// ── UTILS ──
function val(id) { return (document.getElementById(id)||{value:''}).value || ''; }
function initials(name) {
  return name.trim().split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase() || '?';
}
function photoHTML(photoClass, initClass) {
  if (state.photo) return `<img src="${state.photo}" class="${photoClass}" alt="photo">`;
  const n = val('fullName');
  if (n) return `<div class="${initClass}">${initials(n)}</div>`;
  return '';
}

// ── TEMPLATE RENDERERS ──
function renderEntries(entries, tpl) {
  return entries.filter(e => e.org || e.role).map(e => {
    const dateStr = [e.start, e.end].filter(Boolean).join(' – ');
    return `
      <div class="r-entry">
        <div class="r-et">
          <span class="r-org">${e.org||''}</span>
          <span class="r-date">${dateStr}</span>
        </div>
        ${e.role ? `<div class="r-pos">${e.role}</div>` : ''}
        ${e.desc ? `<div class="r-desc">${e.desc.replace(/\n/g,'<br>')}</div>` : ''}
      </div>`;
  }).join('');
}

function renderEduEntries(entries) {
  return entries.filter(e => e.org || e.role).map(e => {
    const dateStr = [e.start, e.end].filter(Boolean).join(' – ');
    return `
      <div class="r-entry">
        <div class="r-et">
          <span class="r-org">${e.org||''}</span>
          <span class="r-date">${dateStr}</span>
        </div>
        ${e.role ? `<div class="r-pos">${e.role}</div>` : ''}
      </div>`;
  }).join('');
}

function asideHTML() {
  const skills = val('skills').split(',').map(s=>s.trim()).filter(Boolean);
  const langs = val('langs').split(',').map(s=>s.trim()).filter(Boolean);
  const certs = val('certs').split('\n').map(s=>s.trim()).filter(Boolean);
  const tpl = state.template;
  let html = '';
  if (skills.length) {
    html += `<div class="aside-title">Skills</div>`;
    if (tpl === 'classic') html += skills.map(s=>`<span class="r-skill">${s}</span>`).join('');
    else if (tpl === 'modern') html += skills.map(s=>`<div class="r-skill">${s}</div>`).join('');
    else html += skills.map(s=>`<span class="r-skill">${s}</span>`).join('');
  }
  if (langs.length) {
    html += `<div class="aside-title">Languages</div>`;
    html += langs.map(s=>`<div class="aside-val">${s}</div>`).join('');
  }
  if (certs.length) {
    html += `<div class="aside-title">Certifications</div>`;
    html += certs.map(s=>`<div class="aside-val">${s}</div>`).join('');
  }
  return html;
}

function renderClassic() {
  const contacts = [val('email'),val('phone'),val('location'),val('linkedin')].filter(Boolean);
  const exp = renderEntries(state.exp, 'classic');
  const edu = renderEduEntries(state.edu);
  return `
    <div class="rh">
      <div class="rh-text">
        <div class="r-name">${val('fullName')||'Your Name'}</div>
        ${val('jobTitle') ? `<div class="r-role">${val('jobTitle')}</div>` : ''}
        ${contacts.length ? `<div class="r-contacts">${contacts.map(c=>`<span>${c}</span>`).join('')}</div>` : ''}
      </div>
      ${photoHTML('rh-photo','rh-init')}
    </div>
    <div class="rb">
      <div class="r-main">
        ${val('summary') ? `<div class="r-sec"><div class="r-sec-title">Profile</div><div class="r-summary">${val('summary').replace(/\n/g,'<br>')}</div></div>` : ''}
        ${exp ? `<div class="r-sec"><div class="r-sec-title">Experience</div>${exp}</div>` : ''}
        ${edu ? `<div class="r-sec"><div class="r-sec-title">Education</div>${edu}</div>` : ''}
      </div>
      <div class="r-aside">${asideHTML()}</div>
    </div>`;
}

function renderModern() {
  const contacts = [val('email'),val('phone'),val('location'),val('linkedin')].filter(Boolean);
  const exp = renderEntries(state.exp, 'modern');
  const edu = renderEduEntries(state.edu);
  return `
    <div class="rh">
      ${photoHTML('rh-photo','rh-init')}
      <div>
        <div class="r-name">${val('fullName')||'Your Name'}</div>
        ${val('jobTitle') ? `<div class="r-role">${val('jobTitle')}</div>` : ''}
        ${contacts.length ? `<div class="r-contacts">${contacts.map(c=>`<span>${c}</span>`).join('')}</div>` : ''}
      </div>
    </div>
    <div class="rb">
      <div class="r-aside">${asideHTML()}</div>
      <div class="r-main">
        ${val('summary') ? `<div class="r-sec"><div class="r-sec-title">Profile</div><div class="r-summary">${val('summary').replace(/\n/g,'<br>')}</div></div>` : ''}
        ${exp ? `<div class="r-sec"><div class="r-sec-title">Experience</div>${exp}</div>` : ''}
        ${edu ? `<div class="r-sec"><div class="r-sec-title">Education</div>${edu}</div>` : ''}
      </div>
    </div>`;
}

function renderMinimal() {
  const contacts = [val('email'),val('phone'),val('location'),val('linkedin')].filter(Boolean);
  const exp = renderEntries(state.exp, 'minimal');
  const edu = renderEduEntries(state.edu);
  return `
    <div class="rh">
      <div class="rh-inner">
        ${photoHTML('rh-photo','rh-init')}
        <div>
          <div class="r-name">${val('fullName')||'Your Name'}</div>
          ${val('jobTitle') ? `<div class="r-role">${val('jobTitle')}</div>` : ''}
        </div>
      </div>
      ${contacts.length ? `<div class="r-contacts">${contacts.map(c=>`<span>${c}</span>`).join('')}</div>` : ''}
    </div>
    <div class="rb">
      <div class="r-main">
        ${val('summary') ? `<div class="r-sec"><div class="r-sec-title">Profile</div><div class="r-summary">${val('summary').replace(/\n/g,'<br>')}</div></div>` : ''}
        ${exp ? `<div class="r-sec"><div class="r-sec-title">Experience</div>${exp}</div>` : ''}
        ${edu ? `<div class="r-sec"><div class="r-sec-title">Education</div>${edu}</div>` : ''}
      </div>
      <div class="r-aside">${asideHTML()}</div>
    </div>`;
}

function render() {
  const paper = document.getElementById('resumePaper');
  if (!paper) return;
  paper.className = `resume-paper tpl-${state.template}`;
  if (state.template === 'classic') paper.innerHTML = renderClassic();
  else if (state.template === 'modern') paper.innerHTML = renderModern();
  else paper.innerHTML = renderMinimal();

  // update sidebar initials
  const n = val('fullName');
  const si = document.getElementById('sideInitials');
  if (si && !state.photo) si.textContent = n ? initials(n) : '?';
}

// ── FORM ENTRY MANAGEMENT ──
function addExp() {
  const id = 'exp' + (++state.expCount);
  state.exp.push({id, org:'', role:'', start:'', end:'', desc:''});
  const block = document.createElement('div');
  block.className = 'entry-card';
  block.id = 'block-' + id;
  block.innerHTML = `
    <button class="rm-btn" onclick="removeExp('${id}')" aria-label="Remove">×</button>
    <label>Company / hotel / group</label>
    <input type="text" placeholder="e.g. Rosewood Bangkok" oninput="updateExp('${id}','org',this.value)">
    <label>Role / title</label>
    <input type="text" placeholder="e.g. Director of Food & Beverage" oninput="updateExp('${id}','role',this.value)">
    <div class="row2">
      <div><label>From</label><input type="text" placeholder="Jan 2020" oninput="updateExp('${id}','start',this.value)"></div>
      <div><label>To</label><input type="text" placeholder="Present" oninput="updateExp('${id}','end',this.value)"></div>
    </div>
    <label>Key achievements</label>
    <textarea placeholder="Specific results with numbers. E.g. Grew F&B revenue 34% YoY, led team of 120, launched 3 outlets." oninput="updateExp('${id}','desc',this.value)"></textarea>`;
  document.getElementById('expBlocks').appendChild(block);
  render();
}

function updateExp(id, key, value) {
  const e = state.exp.find(x => x.id === id);
  if (e) { e[key] = value; render(); }
}

function removeExp(id) {
  state.exp = state.exp.filter(e => e.id !== id);
  const el = document.getElementById('block-' + id);
  if (el) el.remove();
  render();
}

function addEdu() {
  const id = 'edu' + (++state.eduCount);
  state.edu.push({id, org:'', role:'', start:'', end:''});
  const block = document.createElement('div');
  block.className = 'entry-card';
  block.id = 'block-' + id;
  block.innerHTML = `
    <button class="rm-btn" onclick="removeEdu('${id}')" aria-label="Remove">×</button>
    <label>Institution</label>
    <input type="text" placeholder="e.g. ALMA – The Italian Culinary School" oninput="updateEdu('${id}','org',this.value)">
    <label>Degree / qualification</label>
    <input type="text" placeholder="e.g. MBA in Hospitality Management" oninput="updateEdu('${id}','role',this.value)">
    <div class="row2">
      <div><label>From</label><input type="text" placeholder="2006" oninput="updateEdu('${id}','start',this.value)"></div>
      <div><label>To</label><input type="text" placeholder="2008" oninput="updateEdu('${id}','end',this.value)"></div>
    </div>`;
  document.getElementById('eduBlocks').appendChild(block);
  render();
}

function updateEdu(id, key, value) {
  const e = state.edu.find(x => x.id === id);
  if (e) { e[key] = value; render(); }
}

function removeEdu(id) {
  state.edu = state.edu.filter(e => e.id !== id);
  const el = document.getElementById('block-' + id);
  if (el) el.remove();
  render();
}

// ── TEMPLATE SWITCH ──
function setTemplate(tpl, btn) {
  state.template = tpl;
  document.querySelectorAll('.tpl-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  render();
}

// ── PHOTO ──
function setupPhoto() {
  document.getElementById('photoInput').addEventListener('change', function(e) {
    const f = e.target.files[0];
    if (!f) return;
    document.getElementById('photoName').textContent = f.name;
    const reader = new FileReader();
    reader.onload = ev => {
      state.photo = ev.target.result;
      const si = document.getElementById('sideInitials');
      const sp = document.getElementById('sidePhoto');
      if (si) si.style.display = 'none';
      if (sp) { sp.style.display = 'block'; sp.src = state.photo; }
      render();
    };
    reader.readAsDataURL(f);
  });
}

// ── PDF DOWNLOAD ──
function downloadPDF() {
  const name = val('fullName') || 'resume';
  const element = document.getElementById('resumePaper');
  if (!window.html2pdf) { alert('PDF library not loaded yet. Please wait a moment.'); return; }
  const opt = {
    margin: 0,
    filename: name.replace(/\s+/g,'-').toLowerCase() + '-resume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
}

// ── RESUME SUMMARY FOR AI ──
function getResumeSummary() {
  const expText = state.exp.filter(e=>e.org||e.role).map(e =>
    `${e.role||'Role'} at ${e.org||'Company'} (${[e.start,e.end].filter(Boolean).join('–')}): ${e.desc||''}`
  ).join('\n');
  const eduText = state.edu.filter(e=>e.org||e.role).map(e =>
    `${e.role||''} – ${e.org||''} (${[e.start,e.end].filter(Boolean).join('–')})`
  ).join('\n');
  return `
Name: ${val('fullName')}
Title: ${val('jobTitle')}
Location: ${val('location')}
Summary: ${val('summary')}

EXPERIENCE:
${expText || 'Not provided'}

EDUCATION:
${eduText || 'Not provided'}

SKILLS: ${val('skills')}
LANGUAGES: ${val('langs')}
CERTIFICATIONS: ${val('certs')}
`.trim();
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  setupPhoto();
  addExp();
  addEdu();
  render();

  // live render on all form inputs
  document.getElementById('formBody').addEventListener('input', () => render());
});
