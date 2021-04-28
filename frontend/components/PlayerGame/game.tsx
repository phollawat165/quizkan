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
import style from './Home.module.scss';
import temp from 'pages/auth/temp';
import { useRootStore } from '../../stores/stores';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { useEffectOnce, useLifecycles } from 'react-use';

const colors = ['one', 'two', 'three', 'four'];
const icons = [faStar, faCircle, faSquare, faHeart];

export const PlayerGame = observer((props) => {
    const router = useRouter();
    const { user } = useAuth();
    const playerStore = useRootStore().playerStore;
    const webSocketStore = useRootStore().webSocketStore;

    useEffect(() => {
        if (playerStore.page == 1 && !playerStore.questionState) {
            playerStore.UpdatePage(2);
        }
    }, [playerStore.questionState]);

    useEffect(() => {
        if (playerStore.isAnswer) {
            playerStore.UpdatePage(2);
        }
    }, [playerStore.isAnswer]);

    const handleClick = (idx) => {
        webSocketStore.socket.emit('answer', {
            choice: idx,
        });
        playerStore.setIsAnswer(true);
    };

    const forms = [];
    for (
        let i = 0;
        playerStore.questionChoices !== null &&
        i < playerStore.questionChoices.choices.length;
        i += 2
    ) {
        forms.push(
            <Row>
                {playerStore.questionChoices !== null &&
                    i < playerStore.questionChoices.choices.length && (
                        <Col key={i} md={6}>
                            <Card
                                className={`mb-2 ${style[colors[i % 4]]} `}
                                onClick={() => {
                                    handleClick(i);
                                }}>
                                <Row noGutters className="h-100">
                                    {/* Content */}

                                    <Col className="d-flex align-items-center">
                                        <FontAwesomeIcon
                                            icon={icons[i % 4]}
                                            size="6x"
                                            className="mx-auto"
                                            color="white"
                                        />{' '}
                                        {''}
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    )}
                {playerStore.questionChoices !== null &&
                    i + 1 < playerStore.questionChoices.choices.length && (
                        <Col key={i + 1} md={6}>
                            <Card
                                className={`mb-2 ${style[colors[(i + 1) % 4]]}`}
                                onClick={() => {
                                    handleClick(i + 1);
                                }}>
                                <Row noGutters className="h-100">
                                    {/* Content */}

                                    <Col className="d-flex align-items-center">
                                        <FontAwesomeIcon
                                            icon={icons[(i + 1) % 4]}
                                            size="6x"
                                            className="mx-auto"
                                            color="white"
                                        />{' '}
                                        {''}
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    )}
            </Row>,
        );
    }

    return (
        <Container className="mt-4">
            <Row className="mb-3">Your Score : {playerStore.totalScore}</Row>
            {playerStore.questionChoices === null ? (
                'Loading'
            ) : (
                <Container className="mt-2">{forms}</Container>
            )}
        </Container>
    );
});

export default PlayerGame;
