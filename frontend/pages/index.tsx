import React from 'react';
import { Col, Row ,Container} from 'react-bootstrap';
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
    { tag: 'Join Game', link: '' },
    { tag: 'Login', link: '' },
    { tag: 'Registration', link: '' },
];
const rows = [];

rows.push(
    <Row >
          <Col md={6}>
            <CardHome key={0} {...cardTagLogin[0]} />
          </Col>
          <Col md={6}>
            <CardHome key={1} {...cardTagLogin[1]} />
          </Col>
    </Row>
);
rows.push(
    <Row>
          <Col md={6}>
            <CardHome key={2} {...cardTagLogin[2]} />
          </Col>
          <Col md={6}>
            <CardHome key={3} {...cardTagLogin[3]} />
          </Col>
    </Row>
);


export default function Home() {
    return (
        <DefaultLayout>
            <Container className="mt-4">
                {rows}
            </Container>
            
        </DefaultLayout>
    );
}
