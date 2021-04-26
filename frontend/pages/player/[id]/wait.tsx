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

export const PlayerWait: React.FC<any> = observer((props) => {
    const router = useRouter();
    const WebSocketStore = useRootStore().webSocketStore;
    const [joinCount, setJoinCount] = useState(0);
    const [roomID, setRoomID] = useState(router.query.id);
    const [start, serStart] = useState(false);

    useLifecycles(
        () => {
            WebSocketStore.connect();
            // registers
        },
        () => {
            // unregister
            WebSocketStore.socket.off('recieve_message');
            // shutdown
            WebSocketStore.close();
        },
    );
    useEffect(() => {
        WebSocketStore.socket.on('recieve_start', (payload) => {
            if (payload.id == roomID) {
                router.push(`/player/${roomID}/game`);
            }
        });
    }, []);

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
                    Wait for Host
                </Row>
            </Container>
        </DefaultLayout>
    );
});

export default PlayerWait;
