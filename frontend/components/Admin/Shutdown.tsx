import { Button, Card, Form } from 'react-bootstrap';
import React, { useState } from 'react';
import axios from 'axios';

const Shutdown = (props) => {
    const [url, setUrl] = useState();
    const [type, setType] = useState('muted');
    const [message, setMessage] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (setState, event) => {
        setState(event.target.value);
    };

    const handleSubmit = () => {
        if (!url) {
            setMessage('Invalid input');
            setType('danger');
            setSubmitting(false);
            return;
        }
        setSubmitting(true);
        setMessage('Loading');
        setType('muted');
        axios
            .post(url + '/admin/shutdown')
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
                    <Card.Title>Shut down custom server</Card.Title>
                    <Card.Text>
                        Use this tool to shutdown the server and probably the
                        backing container will restart to its initial state.
                        This tool is analogous to{' '}
                        <code>AgonesSDK.shutdown()</code>
                        <Form className="mt-2">
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
                        </Form>
                    </Card.Text>
                    <Button
                        variant="danger"
                        disabled={submitting}
                        onClick={() => {
                            handleSubmit();
                        }}>
                        Shutdown
                    </Button>
                    {message && (
                        <span className={`ml-3 text-${type}`}>{message}</span>
                    )}
                </Card.Body>
            </Card>
        </>
    );
};

export default Shutdown;
