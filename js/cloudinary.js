window.CloudinaryService = (() => {
  const uploadCount = () => Number(sessionStorage.getItem('navprintsUploadCount') || 0);
  let recaptchaScriptPromise = null;

  function loadRecaptcha(siteKey) {
    if (typeof window.grecaptcha?.execute === 'function') {
      return Promise.resolve();
    }

    if (recaptchaScriptPromise) {
      return recaptchaScriptPromise;
    }

    recaptchaScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error('Could not load spam protection.'));
      document.head.appendChild(script);
    });

    return recaptchaScriptPromise;
  }

  async function runRecaptcha() {
    const siteKey = APP_CONFIG.recaptchaSiteKey;

    if (!siteKey || siteKey.includes('YOUR_')) {
      throw new Error('Add the reCAPTCHA site key in js/config.js.');
    }

    await loadRecaptcha(siteKey);

    await new Promise(resolve => grecaptcha.ready(resolve));

    if (typeof grecaptcha.execute !== 'function') {
      throw new Error('reCAPTCHA did not finish loading. Refresh the page and try again.');
    }

    return grecaptcha.execute(siteKey, { action: 'print_upload' });
  }

  async function saveUpload(customerName, file) {
    await FirebaseService.db.collection('uploads').add({
      customerName,
      secureUrl: file.secure_url,
      originalFilename: file.original_filename || file.public_id,
      publicId: file.public_id,
      resourceType: file.resource_type,
      createdAt: FirebaseService.serverTimestamp()
    });
  }

  return {
    async openWidget(customerName) {
      if (!FirebaseService.isConfigured) {
        throw new Error('Firebase has not been configured.');
      }

      if (uploadCount() >= APP_CONFIG.maxSessionUploads) {
        throw new Error(`This browser has reached the ${APP_CONFIG.maxSessionUploads}-upload limit.`);
      }

      if (!APP_CONFIG.cloudinary.cloudName || APP_CONFIG.cloudinary.cloudName.includes('YOUR_')) {
        throw new Error('Cloudinary settings are missing in js/config.js.');
      }

      await runRecaptcha();

      const widget = cloudinary.createUploadWidget({
        cloudName: APP_CONFIG.cloudinary.cloudName,
        uploadPreset: APP_CONFIG.cloudinary.uploadPreset,
        sources: ['local', 'camera'],
        multiple: true,
        resourceType: 'auto',
        maxFiles: APP_CONFIG.maxSessionUploads - uploadCount(),
        clientAllowedFormats: [
          'pdf','c','py','cpp', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx',
          'jpg', 'jpeg', 'png', 'webp', 'mp4'
        ],
        tags: ['expires_in_7_days']
      }, async (error, result) => {
        if (error) return UI.toast('Upload failed. Please try again.', true);
        if (result?.event !== 'success') return;

        try {
          await saveUpload(customerName, result.info);
          sessionStorage.setItem('navprintsUploadCount', String(uploadCount() + 1));
          UI.toast('File sent successfully — we’ll see it in our print queue.');
        } catch {
          UI.toast('The file uploaded, but its order record could not be saved. Please contact us.', true);
        }
      });

      widget.open();
    }
  };
})();
