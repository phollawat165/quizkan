import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faStar,
    faCircle,
    faSquare,
    faHeart,
    faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { Col, Container, Jumbotron, Row, Form, Card } from 'react-bootstrap';
import React, { useState, useEffect, useRef } from 'react';
import quizAns from '../../models/quiz/quizAns';
import style from './Start.module.scss';
import dayjs from 'dayjs';

export const QuestionFrom: React.FC<any> = (props) => {
    const colors = ['one', 'two', 'three', 'four'];
    const icons = [faStar, faCircle, faSquare, faHeart];
    const [choices, setChoices] = useState(props.choices);

    const forms = [];
    for (let i = 0; i < choices.length; i += 2) {
        forms.push(
            <Row>
                {i < choices.length && (
                    <Col key={i} md={6}>
                        <Card className={`mb-2 ${style[colors[i % 4]]} `}>
                            <Row noGutters className="h-100">
                                {/* Content */}
                                <Col md={1} xs={1}></Col>
                                <Col
                                    className={`d-flex align-items-center text-center ${style['text']}`}>
                                    {choices[i].choice}
                                </Col>
                                {choices[i].isCorrect && (
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
                {i + 1 < choices.length && (
                    <Col key={i + 1} md={6}>
                        <Card className={`mb-2 ${style[colors[(i + 1) % 4]]}`}>
                            <Row noGutters className="h-100">
                                {/* Content */}
                                <Col md={1} xs={1}></Col>
                                <Col
                                    className={`d-flex align-items-center text-center ${style['text']}`}>
                                    {choices[i + 1].choice}{' '}
                                </Col>
                                {choices[i + 1].isCorrect && (
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

    return <Container>{forms}</Container>;
};

export default QuestionFrom;
