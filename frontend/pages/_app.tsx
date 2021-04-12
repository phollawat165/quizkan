//import App, { AppContext } from 'next/app';
import '../styles/globals.scss';
import axios from 'axios';
import { SWRConfig, SWRConfiguration } from 'swr';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { enableStaticRendering } from 'mobx-react-lite';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { AuthProvider } from 'hooks/auth';
import { useEffectOnce } from 'react-use';

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
const defaultFetcher = (url) => axios.get(url).then((res) => res.data);
const swrConfig: SWRConfiguration = {
    fetcher: defaultFetcher,
    refreshInterval: 5000,
};

// Export App Component
function MyApp({ Component, pageProps }) {
    // Initialize Firebase
    useEffectOnce(() => {
        import('../services/firebase/client');
    });
    return (
        <SWRConfig value={swrConfig}>
            <AuthProvider>
                <Head>
                    <meta charSet="utf-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
                    />
                    <link rel="manifest" href="/manifest.json" />
                </Head>
                <Component {...pageProps} />
            </AuthProvider>
        </SWRConfig>
    );
}

export default MyApp;
