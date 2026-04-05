# Gamified Habit Tracker

Welcome to your new Gamified Habit Tracker built with a premium masculine Apple Liquid Glass aesthetic.

## Features
*   **XP & Leveling System:** Gain XP for good habits, lose XP for bad habits.
*   **Custom Pomodoro Timer:** Focus sessions automatically link to your habits.
*   **Rewards Shop:** Buy custom rewards with your hard-earned XP to treat yourself.
*   **Firebase Integration:** Syncs seamlessly across devices (Desktop & Mobile).

## Setup & Deployment

### 1. Local Development
1. Run `npm install`
2. Run `npm run dev`
3. Open `http://localhost:3000`

### 2. Firebase Setup (Cloud Sync)
To enable cloud syncing across devices:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project.
3. Add a "Web App" to the project to get your configuration keys.
4. Open `src/firebase.js` in this repo and replace the empty `firebaseConfig` with your keys.
5. In the Firebase Console, navigate to **Build > Authentication** and enable **Google Sign-In**.
6. Navigate to **Build > Firestore Database** and create a database. Set the security rules to:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 3. Deploy to GitHub Pages
1. Push this repository to GitHub on the `main` branch.
2. In your repo settings on GitHub, go to **Settings > Pages**.
3. Set the **Source** to **GitHub Actions**.
4. The `.github/workflows/deploy.yml` action will automatically build and deploy your site on every push!

**Note on Vite Config:** If your repo is named `my-habit-tracker`, make sure you update `vite.config.js` `base:` property to `'/my-habit-tracker/'`. If you are deploying to a root domain, keep it as `'./'`.
