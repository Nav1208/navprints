# Navprints setup

1. In `js/config.js`, replace `YOUR_ADMIN_EMAIL@example.com` with the exact email address of your Firebase Authentication admin user.
2. In `firestore.rules`, replace that same placeholder, then paste the file contents into Firebase Console → Firestore Database → Rules → Publish.
3. Firebase Console → Authentication → Sign-in method: enable **Email/Password**. Create the same admin user in Authentication → Users.
4. Firebase Console → Firestore Database: create the database if you have not already.
5. Cloudinary Console → Settings → Upload → Upload presets: verify `chat_uploads` is **unsigned**. Restrict allowed formats and file sizes, and add the tag `expires_in_7_days` in the preset itself.
6. Google reCAPTCHA Admin Console: add the domain where this site will run. For local testing, add `localhost` and run a local web server; do not open the files directly with `file:///`.
7. Firebase Console → Authentication → Settings → Authorized domains: add your published website domain. `localhost` is normally present for local testing.

## Pages

- `index.html` is the public customer upload page.
- `admin.html` is the private admin login/dashboard.

## Critical security note

The Cloudinary API secret and reCAPTCHA secret must never be saved in these files. Rotate both secrets because they were exposed. A fully static website can execute reCAPTCHA but cannot verify its token securely; a Firebase Function or Cloud Run endpoint is needed for server-side verification.
