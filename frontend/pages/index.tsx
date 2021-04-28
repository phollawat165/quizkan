import React, { useEffect } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { useAuth } from 'hooks/auth';
import Head from 'next/head';
import styles from '../styles/Home.module.scss';
import DefaultLayout from '../layouts/Default';
import CardHome from '../components/Home/CardHome';

const cardTagLogin = [
    { tag: 'Join Game', value: 0, link: 'create' },
    { tag: 'Create Game', value: 1, link: 'create' },
    { tag: 'Host Game', value: 2, link: 'host' },
    { tag: 'Acheivement', value: 3, link: '' },
];
const cardTagNotLogin = [
    { tag: 'Join Game', value: 0, link: 'create' },
    { tag: 'Login', value: 1, link: 'auth/login' },
    { tag: 'Registration', value: 2, link: 'auth/register' },
];
const rowIsLogin = [];
const rowIsNotLogin = [];

rowIsLogin.push(
    <Row>
        <Col md={6}>
            <CardHome key={0} {...cardTagLogin[0]} />
        </Col>
        <Col md={6}>
            <CardHome key={1} {...cardTagLogin[1]} />
        </Col>
    </Row>,
);
rowIsLogin.push(
    <Row>
        <Col md={6}>
            <CardHome key={2} {...cardTagLogin[2]} />
        </Col>
        <Col md={6}>
            <CardHome key={3} {...cardTagLogin[3]} />
        </Col>
    </Row>,
);

rowIsNotLogin.push(
    <Row>
        <Col md={12}>
            <CardHome key={0} {...cardTagNotLogin[0]} />
        </Col>
    </Row>,
);
rowIsNotLogin.push(
    <Row>
        <Col md={6}>
            <CardHome key={1} {...cardTagNotLogin[1]} />
        </Col>
        <Col md={6}>
            <CardHome key={2} {...cardTagNotLogin[2]} />
        </Col>
    </Row>,
);

export default function Home() {
    const { user, loading } = useAuth();
    return (
        <DefaultLayout>
            {!loading && (
                <Container className="pt-4">
                    {user && rowIsLogin}
                    {!user && rowIsNotLogin}
                </Container>
            )}
        </DefaultLayout>
    );
}
