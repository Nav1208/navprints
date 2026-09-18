(() => {
  if (!FirebaseService.isConfigured) return;
  let uploads = [], unsubscribe;
  const render = () => {
    const query = UI.$('search').value.trim().toLowerCase(), sort = UI.$('sort').value;
    const rows = uploads.filter(item => item.customerName.toLowerCase().includes(query)).sort((a,b) => sort === 'name' ? a.customerName.localeCompare(b.customerName) : (sort === 'oldest' ? 1 : -1) * ((a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0)));
    UI.$('uploadList').innerHTML = rows.length ? `<div class="hidden grid-cols-[1.2fr_1.5fr_1fr_auto] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 sm:grid"><span>Customer</span><span>File</span><span>Received</span><span></span></div>${rows.map(item => `<article class="grid gap-2 border-b border-slate-100 px-5 py-4 sm:grid-cols-[1.2fr_1.5fr_1fr_auto] sm:items-center sm:gap-4"><div><p class="font-bold">${UI.escape(item.customerName)}</p><p class="text-xs text-slate-500 sm:hidden">${UI.formatDate(item.createdAt)}</p></div><p class="truncate text-sm text-slate-600">${UI.escape(item.originalFilename || 'Uploaded file')}</p><p class="hidden text-sm text-slate-500 sm:block">${UI.formatDate(item.createdAt)}</p><a href="${encodeURI(item.secureUrl)}" target="_blank" rel="noopener noreferrer" class="inline-flex justify-center rounded-lg bg-brand-600 px-3 py-2 text-sm font-bold text-white">View / download</a></article>`).join('')}` : '<p class="p-8 text-center text-slate-500">No uploads found.</p>';
  };
  UI.$('loginForm').addEventListener('submit', async event => { event.preventDefault(); try { const user = await FirebaseService.auth.signInWithEmailAndPassword(UI.$('email').value.trim(), UI.$('password').value); if (user.user.email !== APP_CONFIG.adminEmail) { await FirebaseService.auth.signOut(); throw new Error('This account is not allowed to access the dashboard.'); } } catch (error) { UI.toast(error.message.replace('Firebase: ', ''), true); } });
  UI.$('logout').addEventListener('click', () => FirebaseService.auth.signOut());
  UI.$('search').addEventListener('input', render); UI.$('sort').addEventListener('change', render);
  FirebaseService.auth.onAuthStateChanged(user => {
    const allowed = user && user.email === APP_CONFIG.adminEmail;
    UI.$('loginPanel').classList.toggle('hidden', !!allowed); UI.$('dashboardPanel').classList.toggle('hidden', !allowed);
    if (unsubscribe) unsubscribe();
    if (allowed) unsubscribe = FirebaseService.db.collection('uploads').orderBy('createdAt', 'desc').onSnapshot(snapshot => { uploads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); render(); }, error => UI.toast('Could not load uploads: ' + error.message, true));
  });
})();
