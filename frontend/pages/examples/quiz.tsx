import { Col, Container, Row } from 'react-bootstrap';

const Quiz = (_props: any) => {
    return (
        <Container>
            <Row>
                <Col>
                    <h1>Quiz</h1>
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={6} className="mb-2 p-2">
                    <div className="d-flex bg-primary">
                        <img
                            className="img-fluid"
                            src="https://picsum.photos/200?a"
                        />

                        <p
                            className="text-light flex-grow-1 text-center align-self-center"
                            style={{ fontSize: '3em' }}>
                            First
                        </p>
                    </div>
                </Col>
                <Col xs={12} sm={6} className="mb-2 p-2">
                    <div className="d-flex bg-success">
                        <img
                            className="img-fluid"
                            src="https://picsum.photos/200?b"
                        />
                        <p
                            className="text-light flex-grow-1 text-center align-self-center"
                            style={{ fontSize: '3em' }}>
                            Second
                        </p>
                    </div>
                </Col>
                <Col xs={12} sm={6} className="mb-2 p-2">
                    <div className="d-flex bg-warning">
                        <img
                            className="img-fluid"
                            src="https://picsum.photos/200?c"
                        />

                        <p
                            className="text-light flex-grow-1 text-center align-self-center"
                            style={{ fontSize: '3em' }}>
                            Third
                        </p>
                    </div>
                </Col>
                <Col xs={12} sm={6} className="mb-2 p-2">
                    <div className="d-flex bg-danger">
                        <img
                            className="img-fluid"
                            src="https://picsum.photos/200?d"
                        />

                        <p
                            className="text-light flex-grow-1 text-center align-self-center"
                            style={{ fontSize: '3em' }}>
                            Fourth
                        </p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Quiz;
