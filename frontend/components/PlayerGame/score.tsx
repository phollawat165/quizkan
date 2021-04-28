import { Col, Row, Container } from 'react-bootstrap';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useRootStore } from '../../stores/stores';
import { observer } from 'mobx-react-lite';
import { useEffectOnce, useLifecycles } from 'react-use';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

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
    /*const tempQuiz = () =>{
    return  {
     id: 0,
     question: "asadaasddddd",
     count:3,
     choices: [
       {id:0,choice:"abc",isCorrect:false},
       {id:1,choice:"bcd",isCorrect:false},
       {id:2,choice:"cde",isCorrect:true},
       {id:3,choice:"def",isCorrect:false},
     ]
   };
 }*/
    useEffect(() => {
        if (playerStore.questionState) {
            setCorrect(null);
            playerStore.UpdatePage(1);
            setBg('blue');
        }
    }, [playerStore.questionState]);

    useEffect(() => {
        if (playerStore.personalScore != null) {
            if (playerStore.personalScore.totalScore > playerStore.totalScore) {
                playerStore.setTotalScore(playerStore.personalScore.totalScore);
                setCorrect(
                    <Col>
                        <Row>
                            <Col className="d-flex align-items-center">
                                <FontAwesomeIcon
                                    icon={faCheck}
                                    size="6x"
                                    className="mx-auto"
                                    color="white"
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>{'Your anwser is correct'}</Col>
                        </Row>
                    </Col>,
                );
                setBg('green');
            } else {
                setCorrect(
                    <Col>
                        <Row>
                            <Col className="d-flex align-items-center">
                                <FontAwesomeIcon
                                    icon={faTimes}
                                    size="6x"
                                    className="mx-auto"
                                    color="white"
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>{'Your anwser is wrong'}</Col>
                        </Row>
                    </Col>,
                );
                setBg('red');
            }
            playerStore.setTimer(0);
            playerStore.setChoice(null);
        }
    }, [playerStore.personalScore]);

    // Render
    return (
        <Container className={`py-4 ${colorMap[bg] || ''}`}>
            <Row className="justify-content-center text-center mb-4 text-white">
                <h1>Your Score is {playerStore.totalScore}</h1>
            </Row>
            <Row className="justify-content-center text-center mb-4 text-white">
                <h3>{correct}</h3>
            </Row>
        </Container>
    );
});

export default PlayerScore;
