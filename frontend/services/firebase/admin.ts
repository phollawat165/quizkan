import * as firebaseAdmin from "firebase-admin";

// Initialize firebase admin sdk for SSR authentication
if (!firebaseAdmin.apps.length && typeof window === 'undefined') {
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;

    if (!privateKey || !clientEmail || !projectId) {
        console.error(
            `Failed to load Firebase credentials. Follow the instructions in the README to set your Firebase credentials inside environment variables.`
        );
    }

    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert({
            privateKey: privateKey,
            clientEmail,
            projectId,
        }),
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        databaseURL: `https://${projectId}.firebaseio.com`,
    });
}

export { firebaseAdmin };