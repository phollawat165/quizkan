//import App, { AppContext } from 'next/app';
import '../styles/globals.scss';
import axios from 'axios';
import { SWRConfig, SWRConfiguration } from 'swr';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { enableStaticRendering } from 'mobx-react-lite';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/messaging';
import 'firebase/analytics';
import Head from 'next/head';

// FontAwesome
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import '@fortawesome/fontawesome-svg-core/styles.css';
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; /* eslint-disable import/first */

// Mobx SSR
enableStaticRendering(typeof window === 'undefined');

// Axios inject host
axios.defaults.baseURL =
    process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:8000';
axios.defaults.withCredentials = true;

// DayJS plugin
dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(utc);

// SWR
const defaultFetcher = (url) => axios.get(url).then(res => res.data);
const swrConfig: SWRConfiguration = {
    fetcher: defaultFetcher,
    refreshInterval: 5000
};

// Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA_f8P5DqjIli43Dr-qJu7MFj9BMKxFzUk",
    authDomain: "quizkan-game.firebaseapp.com",
    projectId: "quizkan-game",
    storageBucket: "quizkan-game.appspot.com",
    messagingSenderId: "755364797956",
    appId: "1:755364797956:web:9b566dc25b1a3e276b1f51",
    measurementId: "G-9RZD85LML7"
};
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
    // Check that `window` is in scope for the analytics module!
    if (typeof window !== 'undefined') {
        // Enable analytics. https://firebase.google.com/docs/analytics/get-started
        if ('measurementId' in firebaseConfig) {
            firebase.analytics();
            //firebase.performance();
        }
    }
}

// Export App Component
function MyApp({ Component, pageProps }) {
    return (
        <SWRConfig value={swrConfig}>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <link rel="manifest" href="/manifest.json" />
            </Head>
            <Component {...pageProps} />
        </SWRConfig>
    );
}

export default MyApp;
