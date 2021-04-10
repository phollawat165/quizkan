import React, { useState } from 'react';
import Link from 'next/link';
import { firebase as firebaseClient } from 'services/firebase/client';
import { useRouter } from 'next/router';
import { useAuth } from 'hooks/auth';

const Login = (_props: any) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const router = useRouter();
    const { user } = useAuth();
    if (user) {
        router.push('/');
    }
    return (
        <div className="container">
            <h1>Login</h1>
            <Link href="/">
                <a>Go back to home page</a>
            </Link>
            <br />
            <div className="form-group">
                <label>Email</label>
                <input
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={'Email'}
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    className="form-control"
                    type={'password'}
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    placeholder={'Password'}
                />
            </div>
            <div className="d-flex">
                <button
                    className="btn btn-secondary mr-2"
                    onClick={async () => {
                        try {
                            await firebaseClient
                                .auth()
                                .createUserWithEmailAndPassword(email, pass);
                            router.push('/');
                        } catch (err) {
                            console.error(err.message);
                        }
                    }}>
                    Create account
                </button>
                <button
                    className="btn btn-primary"
                    onClick={async () => {
                        try {
                            await firebaseClient
                                .auth()
                                .signInWithEmailAndPassword(email, pass);
                            router.push('/');
                        } catch (err) {
                            console.error(err.message);
                        }
                    }}>
                    Log in
                </button>
            </div>
        </div>
    );
};

export default Login;
