import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Form } from 'react-bootstrap';
import DefaultLayout from '../../layouts/Default';
import Link from 'next/link';
import { observer } from 'mobx-react-lite';
import { firebase as firebaseClient } from 'services/firebase/client';
import { useAuth } from 'hooks/auth';

export const login = observer((props) => {
  const router = useRouter();
  const { user } = useAuth();
  //const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  
  return (
    <DefaultLayout>
      <Head>
        <title>Login</title>
      </Head>

      <Container className="">
        <Row className="justify-content-center">
          <Col md={{ span: 4 }}>
            <h2 className="text-center my-3">Login</h2>
            <Form>
              <Form.Group className="">
                <Form.Control
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={'Email'}
                />
              </Form.Group>

              <Form.Group>
                <Form.Control
                  type="password"
                  id="password"
                  value={password}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
               
              </Form.Group>

              <Row className="d-flex justify-content-center">
                <button
                  type="button"
                  className="my-2 btn btn-primary"
                  onClick={async () => {
                    try {
                        await firebaseClient
                            .auth()
                            .signInWithEmailAndPassword(email, password);
                        router.push('/');
                    } catch (err) {
                        console.error(err.message);
                    }
                }}>
                  Login
                </button>
              </Row>

              <Row className="justify-content-center">
                <span>Don't have an account?</span>
                <Link href="/auth/register">
                  <a className="ml-2">Register</a>
                </Link>
              </Row>

            </Form>
          </Col>
        </Row>
      </Container>
    </DefaultLayout>
  );
});

export default login;