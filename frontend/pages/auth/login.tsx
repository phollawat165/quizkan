import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Form } from 'react-bootstrap';
import DefaultLayout from '../../layouts/Default';
import Link from 'next/link';
import { observer } from 'mobx-react-lite';

export const login = observer((props) => {
  const router = useRouter();
  const [state, setState] = useState({
    username: '',
    password: '',
    error: null,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    const payload = {
      username: state.username,
      password: state.password,
    };
  };
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
                  id="username"
                  value={state.username}
                  placeholder="Username"
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Control
                  type="password"
                  id="password"
                  value={state.password}
                  placeholder="Password"
                  onChange={handleChange}
                />
               
              </Form.Group>

              <Row className="d-flex justify-content-center">
                <button
                  type="button"
                  className="my-2 btn btn-primary"
                  onClick={handleSubmitClick}>
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