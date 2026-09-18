window.CloudinaryService = (() => {
  const count = () => Number(sessionStorage.getItem('printUploadCount') || 0);
  const verifyRecaptcha = async () => {
    if (!APP_CONFIG.recaptchaSiteKey || APP_CONFIG.recaptchaSiteKey.includes('YOUR_')) throw new Error('Add your reCAPTCHA site key in js/config.js.');
    await new Promise((resolve, reject) => { if (window.grecaptcha) return resolve(); const script = document.createElement('script'); script.src = `https://www.google.com/recaptcha/api.js?render=6Ldmp8EtAAAAAOlIxTtdNbk3Bach1f9QfpM_qNXU}`; script.onload = resolve; script.onerror = () => reject(new Error('Could not load spam protection.')); document.head.appendChild(script); });
    return grecaptcha.execute(APP_CONFIG.recaptchaSiteKey, { action: 'print_upload' });
  };
  return { async upload(customerName) {
    if (count() >= APP_CONFIG.maxSessionUploads) throw new Error(`This browser has reached the ${APP_CONFIG.maxSessionUploads}-upload session limit.`);
    await verifyRecaptcha();
    if (!FirebaseService.isConfigured) throw new Error('Add your Firebase configuration in js/config.js.');
    if (!APP_CONFIG.cloudinary.cloudName || APP_CONFIG.cloudinary.cloudName.includes('YOUR_')) throw new Error('Add your Cloudinary settings in js/config.js.');
    const widget = cloudinary.createUploadWidget({ cloudName: APP_CONFIG.cloudinary.cloudName, uploadPreset: APP_CONFIG.cloudinary.uploadPreset, sources: ['local', 'camera'], multiple: true, resourceType: 'auto', maxFiles: APP_CONFIG.maxSessionUploads - count(), clientAllowedFormats: ['pdf','doc','docx','ppt','pptx','xls','xlsx','jpg','jpeg','png','webp','mp4'], tags: ['expires_in_7_days'] }, async (error, result) => {
      if (error) return UI.toast('Upload failed. Please try again.', true);
      if (result?.event !== 'success') return;
      try { await FirebaseService.db.collection('uploads').add({ customerName, secureUrl: result.info.secure_url, originalFilename: result.info.original_filename || result.info.public_id, publicId: result.info.public_id, resourceType: result.info.resource_type, createdAt: FirebaseService.serverTimestamp() }); sessionStorage.setItem('printUploadCount', String(count() + 1)); UI.toast('File sent successfully — we’ll see it in our print queue.'); }
      catch { UI.toast('The file uploaded, but we could not save the order. Please contact us.', true); }
    }); widget.open();
  }};
})();
