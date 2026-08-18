BLOODLEGENSMC - Firebase setup

Firebase web config has already been added to app.js.

Before publishing the site:
1. Firebase Console -> Authentication -> Sign-in method -> Google: Enabled.
2. Firebase Console -> Firestore Database: created.
3. Firestore -> Rules: paste the contents of firebase.rules and Publish.
4. Firebase Console -> Authentication -> Settings -> Authorized domains: add the domain where this website will be hosted (Firebase Hosting automatically uses its hosting domain; add any custom domain too).

The site uses:
- Google sign-in
- Firestore collection: votes
- Firestore collection: messages

Voting currently records the Minecraft in-game name and shows recent votes publicly. Chat is available to signed-in Google users.

IMPORTANT: The Firebase web config is intended for client-side use. Do not put Firebase service-account private keys in this website.
