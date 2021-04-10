//import App, { AppContext } from 'next/app';
import '../styles/globals.scss';
import axios from 'axios';
import { SWRConfig, SWRConfiguration } from 'swr';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { enableStaticRendering } from 'mobx-react-lite';
import '../services/firebase/client';
//import '../services/firebase/admin';
import Head from 'next/head';
import { AuthProvider } from 'hooks/auth';

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
    return (
        <SWRConfig value={swrConfig}>
            <AuthProvider>
                <Head>
                    <meta charSet="utf-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1, shrink-to-fit=no"
                    />
                    <link rel="manifest" href="/manifest.json" />
                </Head>
                <Component {...pageProps} />
            </AuthProvider>
        </SWRConfig>
    );
}

export default MyApp;
