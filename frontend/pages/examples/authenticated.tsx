import React from 'react';
import nookies from 'nookies';
import { useRouter } from 'next/router';
import { firebase as firebaseClient } from 'services/firebase/client';

import { InferGetServerSidePropsType, GetServerSidePropsContext } from 'next';
import { useAuth } from 'hooks/auth';

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    // ***ONLY USE DYNAMIC IMPORT OR IT WON'T BUILD THE PRODUCTION IMAGE
    const { firebaseAdmin } = await import('services/firebase/admin');
    try {
        const cookies = nookies.get(ctx);
        const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
        const { uid, email } = token;

        // the user is authenticated!
        // FETCH STUFF HERE

        return {
            props: {
                message: `Your email is ${email} and your UID is ${uid}.`,
            },
        };
    } catch (err) {
        console.log(err.stack);
        // either the `token` cookie didn't exist
        // or token verification failed
        // either way: redirect to the login page
        return {
            redirect: {
                permanent: false,
                destination: '/examples/login',
            },
            // `as never` is required for correct type inference
            // by InferGetServerSidePropsType below
            props: {} as never,
        };
    }
};

function AuthenticatedPage(
    props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
    const router = useRouter();
    const { user } = useAuth();

    return (
        <div className="container my-4" style={{ marginBottom: '6em' }}>
            <div className="row">
                <div className="col">
                    <h2>User</h2>
                    <pre className="bg-light">
                        {JSON.stringify(user, null, 4)}
                    </pre>
                    <p>{props.message!}</p>
                    <button
                        className="btn btn-primary"
                        onClick={async () => {
                            await firebaseClient
                                .auth()
                                .signOut()
                                .then(() => {
                                    router.push('/');
                                });
                        }}>
                        Sign out
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AuthenticatedPage;
