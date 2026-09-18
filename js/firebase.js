window.FirebaseService = (() => {
  const invalid = Object.values(APP_CONFIG.firebase).some(value => !value || value.includes('YOUR_'));
  if (invalid) { UI.toast('Add your Firebase configuration in js/config.js.', true); return { isConfigured: false }; }
  firebase.initializeApp(APP_CONFIG.firebase);
  return { isConfigured: true, auth: firebase.auth(), db: firebase.firestore(), serverTimestamp: firebase.firestore.FieldValue.serverTimestamp };
})();
