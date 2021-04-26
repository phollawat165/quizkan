import React, { useState, useEffect, useContext, createContext } from 'react';
import nookies from 'nookies';
import axios from 'axios';

import { firebase as firebaseClient } from '../services/firebase/client';
import { useRootStore } from 'stores/stores';

const AuthContext = createContext<{
    user: firebaseClient.User | null;
    loading: boolean;
}>({
    user: null,
    loading: true,
});

export function AuthProvider({ children }: any) {
    const [user, setUser] = useState<firebaseClient.User | null>(null);
    const [loading, setLoading] = useState(true);
    const rootStore = useRootStore();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as any).nookies = nookies;
        }
        return firebaseClient.auth().onIdTokenChanged(async (user) => {
            if (loading) {
                setLoading(false);
            }
            console.log(`token changed!`);
            if (!user) {
                console.log(`no token found...`);
                setUser(null);
                nookies.destroy(null, 'token');
                nookies.set(null, 'token', '', {
                    path: '/',
                    domain: window.location.hostname,
                });
                return;
            }

            console.log(`updating token...`);
            const token = await user.getIdToken();
            setUser(user);
            // Update token
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            rootStore.webSocketStore.setToken(token);
            console.log('Updated token for web socket');
            // Sync data
            axios
                .patch(`/users/${user.uid}`, {
                    displayName: user.displayName,
                    email: user.email,
                })
                .catch((error) => {
                    console.warn(
                        'Failed to sync user profile with the server.',
                    );
                });
            // Update device token
            if (localStorage.getItem('deviceToken')) {
                axios
                    .post(`/users/sync`, {
                        name: navigator.userAgent,
                        token: localStorage.getItem('deviceToken'),
                    })
                    .catch((error) => {
                        console.warn(
                            'Failed to set device token. Maybe user are not logged in.',
                        );
                    });
            }
            nookies.destroy(null, 'token');
            nookies.set(null, 'token', token, {
                path: '/',
                domain: window.location.hostname,
            });
        });
    }, []);

    // force refresh the token every 10 minutes
    useEffect(() => {
        const handle = setInterval(async () => {
            console.log(`refreshing token...`);
            const user = firebaseClient.auth().currentUser;
            if (user) await user.getIdToken(true);
        }, 10 * 60 * 1000);
        return () => clearInterval(handle);
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};
