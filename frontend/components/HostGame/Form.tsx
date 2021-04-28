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

export type QuestionProps = Partial<quizAns>;

export const QuestionFrom: React.FC<QuestionProps> = (props) => {
    const colors = ['one', 'two', 'three', 'four'];
    const icons = [faStar, faCircle, faSquare, faHeart];
    const [temp, setTemp] = useState({
        id: props.id,
        order: props.order,
        name: props.name,
        choices: props.choices,
    });

    const getTemp = () => {
        return temp;
    };

    const forms = [];
    for (let i = 0; i < temp.choices.length; i += 2) {
        forms.push(
            <Row>
                {i < temp.choices.length && (
                    <Col key={i} md={6}>
                        <Card className={`mb-2 ${style[colors[i % 4]]} `}>
                            <Row noGutters className="h-100">
                                {/* Content */}
                                <Col md={1} xs={1}></Col>
                                <Col
                                    className={`d-flex align-items-center text-center ${style['text']}`}>
                                    {temp.choices[i].name}
                                </Col>
                                {temp.choices[i].isCorrect && (
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
                {i + 1 < temp.choices.length && (
                    <Col key={i + 1} md={6}>
                        <Card className={`mb-2 ${style[colors[(i + 1) % 4]]}`}>
                            <Row noGutters className="h-100">
                                {/* Content */}
                                <Col md={1} xs={1}></Col>
                                <Col
                                    className={`d-flex align-items-center text-center ${style['text']}`}>
                                    {temp.choices[i + 1].name}{' '}
                                </Col>
                                {temp.choices[i + 1].isCorrect && (
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
        <Container>
            <Row className="mb-3 ml-2">{temp.name}</Row>

            {forms}
        </Container>
    );
};

export default QuestionFrom;
