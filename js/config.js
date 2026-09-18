/*
  Browser-safe configuration only.
  Never place Cloudinary API secrets or reCAPTCHA secret keys in this file.
*/
window.APP_CONFIG = {
  businessName: 'navprints',

  // Replace this with the email address of your Firebase Authentication admin user.
  adminEmail: 'nav@navprints.vercel.app',

  firebase: {
    apiKey: 'AIzaSyBNjLBxKADgiukhsQP0hCGTvKxVRjMNllc',
    authDomain: 'navprintss-4fd2c.firebaseapp.com',
    projectId: 'navprintss-4fd2c',
    storageBucket: 'navprintss-4fd2c.firebasestorage.app',
    messagingSenderId: '659657927447',
    appId: '1:659657927447:web:9754d9fca5896298c6e552'
  },

  cloudinary: {
    cloudName: 'dgjnzhedb',
    uploadPreset: 'chat_uploads'
  },

  recaptchaSiteKey: '6Ldmp8EtAAAAAOlIxTtdNbk3Bach1f9QfpM_qNXU',
  maxSessionUploads: 3
};
