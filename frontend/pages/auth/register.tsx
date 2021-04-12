import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Col, Container, InputGroup, Row, Form, FormGroup } from 'react-bootstrap';
import DefaultLayout from '../../layouts/Default';
import Link from 'next/link';
import axios from 'axios';



export const Register = (props) => {
  const router = useRouter();
  const [state, setState] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    address: "",
    phone: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
    tags: [],
    province: "",
    successMessage: null
  })

  const [required, setRequired] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    address: '',
    phone: '',
    birthDate: '',
    password: '',
    province: '',
    confirmPassword: '',
  })

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSelectMultiChange = (e) => {
    let tempTags = [];
    for (let i=0;i<e.length;i++){
      tempTags.push(e[i]['value']);
    }
    setState((prevState) => ({...prevState,tags: tempTags}));
  }

  const handleSubmitClick = (e) => {
    e.preventDefault();
    let allInfo = true;
    if (!state.username.length) {
      setRequired((prevRequired) => ({ ...prevRequired, username: "*required" }));
      allInfo = false;
    } else setRequired((prevRequired) => ({ ...prevRequired, username: "" }));

    if (!state.firstname.length) {
      setRequired((prevRequired) => ({ ...prevRequired, firstname: "*required" }));
      allInfo = false;
    } else setRequired((prevRequired) => ({ ...prevRequired, firstname: "" }));

    if (!state.lastname.length) {
      setRequired((prevRequired) => ({ ...prevRequired, lastname: "*required" }));
      allInfo = false;
    } else setRequired((prevRequired) => ({ ...prevRequired, lastname: "" }));

    if (!state.address.length) {
      setRequired((prevRequired) => ({ ...prevRequired, address: "*required" }));
      allInfo = false;
    } else setRequired((prevRequired) => ({ ...prevRequired, address: "" }));

    if (!state.email.length) {
      setRequired((prevRequired) => ({ ...prevRequired, email: "*required" }));
      allInfo = false;
    } else setRequired((prevRequired) => ({ ...prevRequired, email: "" }));

    if (!state.birthDate.length) {
      setRequired((prevRequired) => ({ ...prevRequired, birthDate: "*required" }));
      allInfo = false;
    } else setRequired((prevRequired) => ({ ...prevRequired, birthDate: "" }));

    if (!state.password.length) {
      setRequired((prevRequired) => ({ ...prevRequired, password: "*required" }));
      allInfo = false;
    } else setRequired((prevRequired) => ({ ...prevRequired, password: "" }));

    if (!state.confirmPassword.length) {
      setRequired((prevRequired) => ({ ...prevRequired, confirmPassword: "*required" }));
      allInfo = false;
    } else setRequired((prevRequired) => ({ ...prevRequired, confirmPassword: "" }));

    if (!state.phone.length) {
      setRequired((prevRequired) => ({ ...prevRequired, phone: "*required" }));
      allInfo = false;
    } else setRequired((prevRequired) => ({ ...prevRequired, phone: "" }));

    if (!state.province) {
      setRequired(({...required, province:"*required"}))
    } else setRequired(({...required, province:""}))

    if (state.password === state.confirmPassword) {
      if (allInfo) sendDetailsToServer();
    } else {
      setRequired((prevRequired) => ({ ...prevRequired, confirmPassword: "Password not match" }));
    }
  };


  const sendDetailsToServer = () => {
    if (state.email.length && state.password.length) {
      const payload = {
        username: state.username,
        password: state.password,
        email: state.email,
        prefix: 'Mr.',
        firstname: state.firstname,
        lastname: state.lastname,
        birthDate: state.birthDate,
        address: state.address,
        latitude: 12,
        longtitude: 13,
        telNumber: state.phone,
        province: state.province,
        tags: state.tags
      };
      axios
        .post('http://localhost:8000/api/users', payload)
        .then(function (response) {
          if (response.status === 201) {
            setState((prevState) => ({
              ...prevState,
              successMessage:
                'Registration successful. Redirecting to home page..',
            }));
            window.location.href = '/auth/successfulRegister';
          } else {
            console.log('some error occur');
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      console.log('Please enter valid username and password');
    }
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
                <Form.Control
                  type="text"
                  id="firstname"
                  value={state.firstname}
                  placeholder="Firstname"
                  onChange={handleChange}
                />
                <p style={{ color: 'red' }}>{required.firstname}</p>
              </Form.Group>

              <Form.Group>
                <Form.Control
                  type="text"
                  id="lastname"
                  value={state.lastname}
                  placeholder="Lastname"
                  onChange={handleChange}
                />
                <p style={{ color: 'red' }}>{required.lastname}</p>
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
                <Link href="/test">
                  <button
                    type="button"
                    className="my-2 btn btn-primary"
                    onClick={handleSubmitClick}>
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
