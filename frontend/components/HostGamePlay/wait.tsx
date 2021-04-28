import { Col, Row, Container } from 'react-bootstrap';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useRootStore } from '../../stores/stores';
import { observer } from 'mobx-react-lite';
import { useEffectOnce, useLifecycles } from 'react-use';

export const HostWait: React.FC<any> = observer((props) => {
    const router = useRouter();
    const hostStore = useRootStore().hostStore;
    const [joinCount, setJoinCount] = useState(0);
    const [last, setLast] = useState(null);
    const WebSocketStore = useRootStore().webSocketStore;

    const sendStart = () => {
        WebSocketStore.socket.emit('start');
        hostStore.UpdatePage(1);
    };
    useEffect(() => {
        setJoinCount(hostStore.people.count);
        console.log(hostStore.people);
        setLast(hostStore.people.last);
    }, [hostStore.people]);

    // Render
    return (
        <Container className="mt-4">
            <Row className="justify-content-center text-center mb-4">
                Room ID :
            </Row>
            <Row className="justify-content-center text-center mb-4">
                People Join
            </Row>
            <Row className="justify-content-center text-center mb-4">
                {joinCount}
            </Row>
            <Row className="justify-content-center text-center mb-4">
                {last} has joined.
            </Row>
            <Row className="justify-content-center mb-4">
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={sendStart}>
                    Start
                </button>
            </Row>
        </Container>
    );
});

export default HostWait;
