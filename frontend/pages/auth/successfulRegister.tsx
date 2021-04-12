import Head from 'next/head';
import DefaultLayout from '../../layouts/Default';
import { Col, Container, Jumbotron, Row, Form } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import { useRouter } from 'next/router';

export const SuccessfulRegister = () => {
  const router = useRouter();

  return (
    <DefaultLayout>
      <Head>
        <title>Registration Successful</title>
      </Head>
      <Container className="my-4">
        <Col className="d-flex flex-column">
          <Image
            src="/images/user/User.svg"
            className="d-block w-30 mx-auto"
            rounded
          />
          <h2 className="my-2 text-success text-center">
            Registration Successful
          </h2>
          <button
            type="button"
            className="my-2 mx-auto btn btn-primary"
            onClick={() => router.push('/auth/login')}>
            Welcome to LinkedOut
          </button>
        </Col>
      </Container>
    </DefaultLayout>
  );
};
export default SuccessfulRegister;
