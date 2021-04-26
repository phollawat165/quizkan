import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/messaging';
import 'firebase/analytics';
import 'firebase/performance';
import firebaseConfig from './config';
import axios from 'axios';

// Firebase
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
        auth.useEmulator(
            process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST ||
                'http://localhost:9099',
        );
    }
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    // Config Messaging
    const messaging = firebase.messaging();
    window.navigator.serviceWorker.getRegistration('/sw.js').then((sw) => {
        if (typeof sw === 'undefined') {
            console.warn(
                'Service worker registration not found. Messaging will be disabled.',
            );
        } else {
            messaging
                .getToken({
                    vapidKey:
                        process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_VAPID_KEY,
                    serviceWorkerRegistration: sw,
                })
                .then((currentToken) => {
                    if (currentToken) {
                        axios
                            .post(`/users/sync`, {
                                name: navigator.userAgent,
                                token: currentToken,
                            })
                            .catch((error) => {
                                console.warn(
                                    'Failed to set device token. Maybe user are not logged in.',
                                );
                            });
                        window.localStorage.setItem(
                            'deviceToken',
                            currentToken,
                        );
                    } else {
                        console.log(
                            'No registration token available. Request permission to generate one.',
                        );
                    }
                })
                .catch((err) => {
                    console.warn(
                        'An error occurred while retrieving token.',
                        err,
                    );
                });
        }
    });

    // Assign to window
    (window as any).firebase = firebase;
}

export { firebase };
