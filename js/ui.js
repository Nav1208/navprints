window.UI = {
  $: id => document.getElementById(id),
  toast(message, error = false) { const t = this.$('toast'); t.textContent = message; t.className = `toast show fixed bottom-5 left-5 right-5 z-30 mx-auto max-w-md rounded-xl px-4 py-3 text-center font-medium text-white shadow-xl ${error ? 'bg-rose-600' : 'bg-emerald-600'}`; clearTimeout(this.timer); this.timer = setTimeout(() => t.classList.remove('show'), 4200); },
  escape(value) { const el = document.createElement('div'); el.textContent = value || ''; return el.innerHTML; },
  formatDate(timestamp) { return timestamp?.toDate ? timestamp.toDate().toLocaleString() : 'Just received'; }
};
document.querySelectorAll('[data-business-name]').forEach(el => el.textContent = APP_CONFIG.businessName);
document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
