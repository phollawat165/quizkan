import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import {
    Navbar,
    Nav,
    Col,
    Container,
    Jumbotron,
    Row,
    Form,
    Card,
    NavDropdown,
} from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from 'hooks/auth';
import { firebase as firebaseClient } from 'services/firebase/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faStar,
    faCircle,
    faSquare,
    faHeart,
    faCheck,
} from '@fortawesome/free-solid-svg-icons';
import style from './Start.module.scss';
import temp from 'pages/auth/temp';
import { useRootStore } from '../../stores/stores';
import { observer } from 'mobx-react-lite';
import { useEffectOnce, useLifecycles } from 'react-use';

//create your forceUpdate hook
function useForceUpdate() {
    const [value, setValue] = useState(0); // integer state
    return () => setValue((value) => value + 1); // update the state to force render
}

export const HostGame = observer((props) => {
    const router = useRouter();
    const hostStore = useRootStore().hostStore;
    const tempQuiz = (state) => {
        if (state) {
            return hostStore.questionChoices;
        } else {
            return hostStore.answerChoices;
        }
    };
    const { user } = useAuth();
    const [show, setShow] = useState(false);
    const [word, setWord] = useState('Answer');
    const quizId = router.query.id;
    const webSocketStore = useRootStore().webSocketStore;
    const colors = ['one', 'two', 'three', 'four'];
    const [data, setData] = useState(null);
    const [count, setCount] = useState(0);

    // HACK
    const forceUpdate = useForceUpdate();

    const handleClick = async () => {
        if (hostStore.questionState) {
            webSocketStore.socket.emit('skip');
            setData(tempQuiz(false));
            setWord('Next');
        } else {
            webSocketStore.socket.emit('next');
            setWord('Answer');
        }
    };
    useEffect(() => {
        if (hostStore.state == 'finished') {
            hostStore.UpdatePage(2);
        }
    }, [hostStore.state]);
    useEffect(() => {
        if (hostStore.questionState != null) {
            setData(tempQuiz(hostStore.questionState));
            forceUpdate();
            setWord(hostStore.questionState ? 'Answer' : 'Next');
        }
    }, [hostStore.questionState]);

    useEffect(() => {
        if (data != null) {
            console.log('checkTemp');
            forceUpdate();
            setCount(data.choices.length);
            console.log(data);
        }
    }, [data]);

    const formsQuestion = [];
    for (
        let i = 0;
        hostStore.questionChoices != null &&
        i < hostStore.questionChoices.choices.length;
        i += 2
    ) {
        formsQuestion.push(
            <Row>
                {data != null && i < data.choices.length && (
                    <Col key={i} md={6}>
                        <Card className={`mb-2 ${style[colors[i % 4]]} `}>
                            <Row noGutters className="h-100">
                                {/* Content */}
                                <Col md={1} xs={1}></Col>
                                <Col
                                    className={`d-flex align-items-center text-center ${style['text']}`}>
                                    {data.choices[i].name}
                                </Col>
                                {data.choices[i].isCorrect && (
                                    <Col className="d-flex align-items-center">
                                        <FontAwesomeIcon
                                            icon={faCheck}
                                            size="6x"
                                            className="mx-auto"
                                            color="white"
                                        />{' '}
                                        {''}
                                    </Col>
                                )}
                            </Row>
                        </Card>
                    </Col>
                )}
                {data != null && i + 1 < data.choices.length && (
                    <Col key={i + 1} md={6}>
                        <Card className={`mb-2 ${style[colors[(i + 1) % 4]]}`}>
                            <Row noGutters className="h-100">
                                {/* Content */}
                                <Col md={1} xs={1}></Col>
                                <Col
                                    className={`d-flex align-items-center text-center ${style['text']}`}>
                                    {data.choices[i + 1].name}{' '}
                                </Col>
                                {data.choices[i + 1].isCorrect && (
                                    <Col className="d-flex align-items-center">
                                        <FontAwesomeIcon
                                            icon={faCheck}
                                            size="6x"
                                            className="mx-auto"
                                            color="white"
                                        />{' '}
                                        {''}
                                    </Col>
                                )}
                            </Row>
                        </Card>
                    </Col>
                )}
            </Row>,
        );
    }

    const forms = [];
    for (let i = 0; data != null && i < data.choices.length; i += 2) {
        forms.push(
            <Row>
                {data != null && i < data.choices.length && (
                    <Col key={i} md={6}>
                        <Card className={`mb-2 ${style[colors[i % 4]]} `}>
                            <Row noGutters className="h-100">
                                {/* Content */}
                                <Col md={1} xs={1}></Col>
                                <Col
                                    className={`d-flex align-items-center text-center ${style['text']}`}>
                                    {data.choices[i].name}
                                </Col>
                                {data.choices[i].isCorrect && (
                                    <Col className="d-flex align-items-center">
                                        <FontAwesomeIcon
                                            icon={faCheck}
                                            size="6x"
                                            className="mx-auto"
                                            color="white"
                                        />{' '}
                                        {''}
                                    </Col>
                                )}
                            </Row>
                        </Card>
                    </Col>
                )}
                {data != null && i + 1 < data.choices.length && (
                    <Col key={i + 1} md={6}>
                        <Card className={`mb-2 ${style[colors[(i + 1) % 4]]}`}>
                            <Row noGutters className="h-100">
                                {/* Content */}
                                <Col md={1} xs={1}></Col>
                                <Col
                                    className={`d-flex align-items-center text-center ${style['text']}`}>
                                    {data.choices[i + 1].name}{' '}
                                </Col>
                                {data.choices[i + 1].isCorrect && (
                                    <Col className="d-flex align-items-center">
                                        <FontAwesomeIcon
                                            icon={faCheck}
                                            size="6x"
                                            className="mx-auto"
                                            color="white"
                                        />{' '}
                                        {''}
                                    </Col>
                                )}
                            </Row>
                        </Card>
                    </Col>
                )}
            </Row>,
        );
    }

    return (
        <Container className="mt-4">
            <Row>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleClick}>
                    {word}
                </button>
            </Row>
            {data === null ? (
                'Loading'
            ) : (
                <Card className="mt-4">
                    <Card.Title>Question </Card.Title>
                    <Row className="mb-3 ml-2">{data.name}</Row>
                    {forms}
                </Card>
            )}
        </Container>
    );
});

export default HostGame;
