(() => {
  if (!FirebaseService.isConfigured) return;

  const configuredAdminEmail = APP_CONFIG.adminEmail.toLowerCase();

  if (configuredAdminEmail.includes('your_admin_email')) {
    UI.toast('Set your real admin email in js/config.js before signing in.', true);
    return;
  }

  let uploads = [];
  let unsubscribe = null;

  function sortAndFilterUploads() {
    const query = UI.byId('search').value.trim().toLowerCase();
    const sort = UI.byId('sort').value;

    return uploads
      .filter(upload => upload.customerName.toLowerCase().includes(query))
      .sort((first, second) => {
        if (sort === 'name') return first.customerName.localeCompare(second.customerName);
        const difference = (first.createdAt?.seconds || 0)
          - (second.createdAt?.seconds || 0);
        return sort === 'oldest' ? difference : -difference;
      });
  }

  function renderUploads() {
    const rows = sortAndFilterUploads();
    const list = UI.byId('uploadList');

    if (!rows.length) {
      list.innerHTML = '<p class="p-8 text-center text-slate-500">No uploads found.</p>';
      return;
    }

    const header = `
      <div class="hidden grid-cols-[1.2fr_1.5fr_1fr_auto] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 sm:grid">
        <span>Customer</span><span>File</span><span>Received</span><span></span>
      </div>
    `;
    const content = rows.map(upload => `
      <article class="grid gap-2 border-b border-slate-100 px-5 py-4 sm:grid-cols-[1.2fr_1.5fr_1fr_auto] sm:items-center sm:gap-4">
        <div>
          <p class="font-bold">${UI.escapeHtml(upload.customerName)}</p>
        <p class="text-xs text-slate-500 sm:hidden">
          ${UI.formatDate(upload.createdAt)}
        </p>
        </div>
        <p class="truncate text-sm text-slate-600">
          ${UI.escapeHtml(upload.originalFilename || 'Uploaded file')}
        </p>
        <p class="hidden text-sm text-slate-500 sm:block">${UI.formatDate(upload.createdAt)}</p>
        <a href="${encodeURI(upload.secureUrl)}" target="_blank" rel="noopener noreferrer" class="inline-flex justify-center rounded-lg bg-brand-600 px-3 py-2 text-sm font-bold text-white">
          View / download
        </a>
      </article>
    `).join('');

    list.innerHTML = header + content;
  }

  async function signIn(event) {
    event.preventDefault();

    try {
      const email = UI.byId('email').value.trim();
      const password = UI.byId('password').value;
      const credential = await FirebaseService.auth.signInWithEmailAndPassword(
        email,
        password
      );

      if (credential.user.email.toLowerCase() !== configuredAdminEmail) {
        await FirebaseService.auth.signOut();
        throw new Error('This account is not allowed to access the dashboard.');
      }
    } catch (error) {
      UI.toast(error.message.replace('Firebase: ', ''), true);
    }
  }

  UI.byId('loginForm').addEventListener('submit', signIn);
  UI.byId('logout').addEventListener('click', () => FirebaseService.auth.signOut());
  UI.byId('search').addEventListener('input', renderUploads);
  UI.byId('sort').addEventListener('change', renderUploads);

  FirebaseService.auth.onAuthStateChanged(user => {
    const isAdmin = user?.email?.toLowerCase() === configuredAdminEmail;
    UI.byId('loginPanel').classList.toggle('hidden', isAdmin);
    UI.byId('dashboardPanel').classList.toggle('hidden', !isAdmin);

    if (unsubscribe) unsubscribe();
    if (!isAdmin) return;

    unsubscribe = FirebaseService.db.collection('uploads').orderBy(
      'createdAt',
      'desc'
    ).onSnapshot(snapshot => {
      uploads = snapshot.docs.map(document => ({ id: document.id, ...document.data() }));
      renderUploads();
    }, error => {
      UI.toast(`Could not load uploads: ${error.message}`, true);
    });
  });
})();
