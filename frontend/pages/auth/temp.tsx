import React, { useState } from 'react';
import Link from 'next/link';
import { firebase as firebaseClient } from 'services/firebase/client';
import { useRouter } from 'next/router';
import { useAuth } from 'hooks/auth';

const temp = (_props: any) => {
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
        </div>
    );
};

export default temp;
