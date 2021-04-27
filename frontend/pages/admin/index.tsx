import { faTools } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SetGame from 'components/Admin/SetGame';
import Shutdown from 'components/Admin/Shutdown';
import { useAuth } from 'hooks/auth';
import DefaultLayout from 'layouts/Default';
import React from 'react';
import { Col, Container, Row, Card } from 'react-bootstrap';
import Spinner from '../../components/Admin/Spinner';

const Admin = (props: any) => {
    const user = false;
    return (
        <DefaultLayout>
            <Container className="py-4">
                {user ? (
                    <Row className="mt-4">
                        <Col className="text-center">
                            <Spinner />
                        </Col>
                    </Row>
                ) : (
                    <>
                        <Row>
                            <Col>
                                <h1>
                                    <FontAwesomeIcon icon={faTools} /> Admin
                                    Tools{' '}
                                </h1>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <SetGame />
                            </Col>
                            <Col md={6}>
                                <Shutdown />
                            </Col>
                        </Row>
                    </>
                )}
            </Container>
        </DefaultLayout>
    );
};

export default Admin;
