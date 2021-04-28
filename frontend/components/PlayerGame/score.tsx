import { Col, Row, Container } from 'react-bootstrap';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useRootStore } from '../../stores/stores';
import { observer } from 'mobx-react-lite';
import { useEffectOnce, useLifecycles } from 'react-use';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const ResultCard = ({ text, icon }: { text: string; icon: IconProp }) => {
    return (
        <Col>
            <Row>
                <Col className="d-flex align-items-center">
                    <FontAwesomeIcon
                        icon={icon}
                        size="6x"
                        className="mx-auto"
                        color="white"
                    />
                </Col>
            </Row>
            <Row>
                <Col>{text}</Col>
            </Row>
        </Col>
    );
};

export const PlayerScore: React.FC<any> = observer((props) => {
    const router = useRouter();
    const playerStore = useRootStore().playerStore;
    const [roomID, setRoomID] = useState(router.query.id);
    const [start, serStart] = useState(false);
    const [score, setScore] = useState(playerStore.totalScore);
    const [correct, setCorrect] = useState(null);
    const [show, setShow] = useState(false);
    const WebSocketStore = useRootStore().webSocketStore;
    const [bg, setBg] = useState('blue');
    const colorMap = {
        blue: 'bg-info',
        red: 'bg-danger',
        green: 'bg-success',
    };

    useEffect(() => {
        if (playerStore.questionState && !playerStore.isAnswer) {
            setCorrect(null);
            playerStore.UpdatePage(1);
            setBg('blue');
        } else if (!playerStore.questionState && playerStore.isAnswer) {
            setCorrect(null);
            playerStore.setIsAnswer(false);
            setBg('blue');
        }
    }, [playerStore.questionState]);

    useEffect(() => {
        if (
            playerStore.personalScore != null &&
            playerStore.state == 'running' &&
            !playerStore.questionState
        ) {
            if (playerStore.personalScore.totalScore > playerStore.totalScore) {
                playerStore.setTotalScore(playerStore.personalScore.totalScore);
                setCorrect(
                    <ResultCard icon={faCheck} text="Your anwser is correct" />,
                );
                setBg('green');
            } else {
                setCorrect(
                    <ResultCard icon={faTimes} text="Your anwser is wrong" />,
                );
                setBg('red');
            }
            playerStore.setTimer(0);
            playerStore.setChoice(null);
        }
    }, [playerStore.personalScore]);
    const endSession = () => {
        WebSocketStore.socket.close();
        router.push('/');
    };
    // Render
    return (
        <Container className={`py-4 ${colorMap[bg] || ''}`}>
            <Row className="justify-content-center text-center mb-4 text-white">
                <h1>Your Score is {playerStore.totalScore}</h1>
            </Row>
            <Row className="justify-content-center text-center mb-4 text-white">
                <h3>{correct}</h3>
            </Row>
            {playerStore.state == 'finished' && (
                <Row className="justify-content-center mb-4">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={endSession}>
                        end
                    </button>
                </Row>
            )}
        </Container>
    );
});

export default PlayerScore;
