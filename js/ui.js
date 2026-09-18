window.UI = {
  byId(id) {
    return document.getElementById(id);
  },

  toast(message, isError = false) {
    const toast = this.byId('toast');
    toast.textContent = message;
    const colorClass = isError ? 'bg-rose-600' : 'bg-emerald-600';
    toast.className = [
      'toast', 'show', 'fixed', 'bottom-5', 'left-5', 'right-5',
      'z-30', 'mx-auto', 'max-w-md', 'rounded-xl', 'px-4', 'py-3',
      'text-center', 'font-medium', 'text-white', 'shadow-xl', colorClass
    ].join(' ');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => toast.classList.remove('show'), 4200);
  },

  escapeHtml(value) {
    const element = document.createElement('div');
    element.textContent = value || '';
    return element.innerHTML;
  },

  formatDate(timestamp) {
    return timestamp?.toDate ? timestamp.toDate().toLocaleString() : 'Just received';
  }
};

document.querySelectorAll('[data-business-name]').forEach(element => {
  element.textContent = APP_CONFIG.businessName;
});

document.querySelectorAll('[data-year]').forEach(element => {
  element.textContent = new Date().getFullYear();
});
