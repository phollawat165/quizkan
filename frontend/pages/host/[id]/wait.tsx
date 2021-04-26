import { Col, Row, Container } from 'react-bootstrap';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.scss';
import DefaultLayout from '../../../layouts/Default';
import QuizGrid from '../../../components/HostGame/Grid';
import QuizPagination from '../../../components/HostGame/Pagination';
import { useRootStore } from '../../../stores/stores';
import { observer } from 'mobx-react-lite';
import { useEffectOnce, useLifecycles } from 'react-use';

export const hostGame: React.FC<any> = observer((props) => {
    const router = useRouter();
    const HostStore = useRootStore().hostStore;
    const WebSocketStore = useRootStore().webSocketStore;
    const [joinCount, setJoinCount] = useState(0);
    const roomID = router.query.id;

    useLifecycles(
        () => {
            WebSocketStore.connect();
            // registers
        },
        () => {
            // unregister
            WebSocketStore.socket?.off('recieve_message');
            // shutdown
            WebSocketStore.close();
        },
    );

    const sendStart = () => {
        WebSocketStore.socket.emit('send_start', {
            chatRoomId: roomID,
        });
        router.push(`/host/${roomID}/game`);
    };

    // Render
    return (
        <DefaultLayout>
            <Head>
                <title>Host Game Wait</title>
            </Head>
            <Container className="mt-4">
                <Row className="justify-content-center text-center mb-4">
                    Room ID : {router.query.id}
                </Row>
                <Row className="justify-content-center text-center mb-4">
                    People Join
                </Row>
                <Row className="justify-content-center text-center mb-4">
                    {joinCount}
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
        </DefaultLayout>
    );
});

export default hostGame;
