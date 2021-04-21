import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Col, Container, InputGroup, Row, Form, FormGroup } from 'react-bootstrap';
import DefaultLayout from '../../layouts/Default';
import Link from 'next/link';
import axios from 'axios';
import { firebase as firebaseClient } from 'services/firebase/client';
import { useAuth } from 'hooks/auth';


export const Register = (props) => {
  const router = useRouter();
  const { user } = useAuth();
  const [ready, setReady] = useState(false);
  const [state, setState] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    successMessage: null
  })

  const [required, setRequired] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmitClick = (e) => {
      e.preventDefault();
      let allInfo = true;
      if (!state.username.length) {
        setRequired((prevRequired) => ({ ...prevRequired, username: "*required" }));
        allInfo = false;
      } else setRequired((prevRequired) => ({ ...prevRequired, username: "" }));

      if (!state.email.length) {
        setRequired((prevRequired) => ({ ...prevRequired, email: "*required" }));
        allInfo = false;
      } else setRequired((prevRequired) => ({ ...prevRequired, email: "" }));

    
      if (!state.password.length) {
        setRequired((prevRequired) => ({ ...prevRequired, password: "*required" }));
        allInfo = false;
      } else setRequired((prevRequired) => ({ ...prevRequired, password: "" }));

      if (!state.confirmPassword.length) {
        setRequired((prevRequired) => ({ ...prevRequired, confirmPassword: "*required" }));
        allInfo = false;
      } else setRequired((prevRequired) => ({ ...prevRequired, confirmPassword: "" }));

      if (state.password === state.confirmPassword) {
        if (allInfo) {
          console.log("aaaaa");
          (async () => {
          
          try {
              await firebaseClient
                  .auth()
                  .createUserWithEmailAndPassword(state.email, state.password);
          } catch (err) {
              console.error(err.message);
          }
        })();
      }}
    else {
        setRequired((prevRequired) => ({ ...prevRequired, confirmPassword: "Password not match" }));
      }
    };
    useEffect(() => {
      if(user){
        setReady(true);
      }
    },[user]);

    if(ready){
      (async () => {
        try {
            await user.updateProfile({
                  displayName: state.username
                });
            router.push('/');
        } catch (err) {
            console.error(err.message);
        }
      })();
    }
  
  return (
    <DefaultLayout>
      <Head>
        <title>Register</title>
      </Head>

      <Container className="my-4">
        <Row className="justify-content-center">
          <Col md={{ span: 5 }} className="d-flex flex-column">
            <Form>
              <Form.Group className="">
                <i className="bi bi-person-fill"></i>
                <Form.Control
                  type="text"
                  id="username"
                  value={state.username}
                  placeholder="Username"
                  onChange={handleChange}
                  required
                />
                <p style={{ color: 'red' }}>{required.username}</p>
              </Form.Group>

              <Form.Group>
                <i className="bi bi-envelope-fill"></i>
                <Form.Control
                  type="email"
                  id="email"
                  value={state.email}
                  placeholder="Email"
                  onChange={handleChange}
                />
                <p style={{ color: 'red' }}>{required.email}</p>
              </Form.Group>

              <Form.Group>
                <i className="bi bi-key-fill"></i>
                <Form.Control
                  type="password"
                  id="password"
                  value={state.password}
                  placeholder="Password"
                  onChange={handleChange}
                />
                <p style={{ color: 'red' }}>{required.password}</p>
              </Form.Group>

              <Form.Group>
                <Form.Control
                  type="password"
                  id="confirmPassword"
                  value={state.confirmPassword}
                  placeholder="Confirm Password"
                  onChange={handleChange}
                />
                <p style={{ color: 'red' }}>{required.confirmPassword}</p>
              </Form.Group>
              <Row className="d-flex justify-content-center">
                <Link href="/">
                  <button
                    type="button"
                    className="my-2 btn btn-primary"
                    onClick={ handleSubmitClick}>
                    Register
                </button>
                </Link>
              </Row>
              <Row className="justify-content-center">
                <span>Already have an account?</span>
                <Link href="/auth/login">
                  <a className="ml-2">Login</a>
                </Link>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </DefaultLayout>
  );
};



export default Register;
