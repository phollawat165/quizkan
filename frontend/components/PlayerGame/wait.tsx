import { Col, Row, Container } from 'react-bootstrap';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useRootStore } from '../../stores/stores';
import { observer } from 'mobx-react-lite';
import { useEffectOnce, useLifecycles } from 'react-use';

export const PlayerWait: React.FC<any> = observer((props) => {
    const router = useRouter();
    const [roomID, setRoomID] = useState(router.query.id);
    const [start, serStart] = useState(false);
    const playerStore = useRootStore().playerStore;

    useEffect(() => {
        (async () => {
            if (playerStore.state == 'running') {
                await playerStore.UpdatePage(1);
            }
        })();
    }, [playerStore.state]);

    // Render
    return (
        <Container className="mt-4">
            <Row className="justify-content-center text-center mb-4">
                Room ID : {router.query.id}
            </Row>
            <Row className="justify-content-center text-center mb-4">
                Wait for Host
            </Row>
        </Container>
    );
});

export default PlayerWait;
