import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/messaging';
import 'firebase/analytics';
import 'firebase/performance';

// Firebase
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
if (!firebase.apps.length && typeof window !== 'undefined') {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    // Enable analytics. https://firebase.google.com/docs/analytics/get-started
    if ('measurementId' in firebaseConfig) {
        if (process.env.NEXT_PUBLIC_FIREBASE_ENABLE_ANALYTICS == 'true')
            firebase.analytics();
        if (process.env.NEXT_PUBLIC_FIREBASE_ENABLE_PERFORMANCE == 'true')
            firebase.performance();
    }
    // Config Auth
    if (process.env.NEXT_PUBLIC_FIREBASE_ENABLE_EMULATOR == 'true') {
        const auth = firebase.auth();
        auth.useEmulator(process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST || 'http://localhost:9099');
    }
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    // Assign to window
    (window as any).firebase = firebase;
}

export { firebase };
