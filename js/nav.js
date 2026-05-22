function showPage(pageId, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  if (btn) btn.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
  showPage('pageBuilder', document.querySelector('.nav-tab'));
});
