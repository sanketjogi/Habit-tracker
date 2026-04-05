// Firebase Configuration and Auth flow for Gamified Habit Tracker
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";

// TODO: Replace with the actual Firebase config object provided by the User in the setup phase
// To get started, you'll need to create a project at console.firebase.google.com
const firebaseConfig = {
  // apiKey: "YOUR_API_KEY",
  // authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  // projectId: "YOUR_PROJECT_ID",
  // storageBucket: "YOUR_PROJECT_ID.appspot.com",
  // messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  // appId: "YOUR_APP_ID"
};

let app, auth, db, provider;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  provider = new GoogleAuthProvider();
} catch (error) {
  console.warn("Firebase not properly configured yet. App will run in local-only mode.", error);
}

export function setupAuth(onAuthChangeCallback) {
  if (!auth) {
      // Simulate auth for local dev if Firebase isn't set up
      console.log("Running in local mode. Simulating user.");
      const mockUser = { uid: "localUser123", displayName: "Local Player", photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" };
      
      const loginBtn = document.getElementById('google-signin-btn');
      if(loginBtn) {
          loginBtn.onclick = () => onAuthChangeCallback(mockUser);
      }
      
      // Auto login locally
      setTimeout(() => onAuthChangeCallback(mockUser), 500);
      return;
  }

  onAuthStateChanged(auth, (user) => {
    onAuthChangeCallback(user);
  });

  const loginBtn = document.getElementById('google-signin-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      signInWithPopup(auth, provider).catch((error) => {
        console.error("Auth Error:", error);
        alert("Sign in failed. Check console.");
      });
    });
  }
}

export function signOutUser() {
  if (auth) {
      firebaseSignOut(auth).then(() => {
          // Sign-out successful.
          window.location.reload();
      });
  } else {
      window.location.reload();
  }
}

export async function syncStateToCloud(userId, stateObject) {
  if (!db) return; // Local mode
  try {
    await setDoc(doc(db, "users", userId), stateObject, { merge: true });
    console.log("State synced to cloud.");
  } catch (e) {
    console.error("Error syncing to cloud:", e);
  }
}

export async function loadStateFromCloud(userId) {
  if (!db) return null; // Local mode
  try {
    const docSnap = await getDoc(doc(db, "users", userId));
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (e) {
    console.error("Error loading from cloud:", e);
  }
  return null;
}
