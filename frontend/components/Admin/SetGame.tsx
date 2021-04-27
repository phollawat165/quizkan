import { Button, Card, Form } from 'react-bootstrap';
import React, { useState } from 'react';
import axios from 'axios';

const SetGame = (props) => {
    const [url, setUrl] = useState();
    const [quiz, setQuiz] = useState();
    const [type, setType] = useState('muted');
    const [message, setMessage] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (setState, event) => {
        setState(event.target.value);
    };

    const handleSubmit = () => {
        if (!url || !quiz) {
            setMessage('Invalid input');
            setType('danger');
            setSubmitting(false);
            return;
        }
        setSubmitting(true);
        setMessage('Loading');
        setType('muted');
        axios
            .post(url + '/admin/game', { quiz: quiz })
            .then(() => {
                setMessage('Success');
                setType('success');
            })
            .catch((err) => {
                setMessage(
                    'Failed: ' +
                        (err.response?.data?.message || 'Something went wrong'),
                );
                setType('danger');
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    return (
        <>
            <Card>
                <Card.Body>
                    <Card.Title>Set game for the custom server</Card.Title>
                    <Card.Text>
                        <Form>
                            <Form.Group>
                                <Form.Label>
                                    Server URL (including port without trailing
                                    slash)
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="http://localhost:8001"
                                    onChange={(e) => handleChange(setUrl, e)}
                                />
                                <Form.Text className="text-muted">
                                    Enter the custom server url which we will
                                    send the request to
                                </Form.Text>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Quiz ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                    onChange={(e) => handleChange(setQuiz, e)}
                                />
                                <Form.Text className="text-muted">
                                    MongoDB ObjecID
                                </Form.Text>
                            </Form.Group>
                        </Form>
                    </Card.Text>
                    <Button
                        variant="success"
                        disabled={submitting}
                        onClick={() => {
                            handleSubmit();
                        }}>
                        Set
                    </Button>
                    {message && (
                        <span className={`ml-3 text-${type}`}>{message}</span>
                    )}
                </Card.Body>
            </Card>
        </>
    );
};

export default SetGame;
