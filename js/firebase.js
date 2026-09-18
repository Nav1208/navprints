window.FirebaseService = (() => {
  const values = Object.values(APP_CONFIG.firebase);
  const isConfigured = values.every(value => value && !value.includes('YOUR_'));

  if (!isConfigured) {
    UI.toast('Firebase settings are missing in js/config.js.', true);
    return { isConfigured: false };
  }

  firebase.initializeApp(APP_CONFIG.firebase);

  return {
    isConfigured: true,
    auth: typeof firebase.auth === 'function' ? firebase.auth() : null,
    db: firebase.firestore(),
    serverTimestamp: firebase.firestore.FieldValue.serverTimestamp
  };
})();
