import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faStar,
    faCircle,
    faSquare,
    faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { Col, Container, Jumbotron, Row, Form, Card } from 'react-bootstrap';
import React, { useState, useEffect, useRef } from 'react';
import quizAns from '../../models/quiz/quizAns';

import style from './CreateQuiz.module.scss';
import dayjs from 'dayjs';
import { useEffectOnce } from 'react-use';

export type QuestionProps = Partial<quizAns> & {
    onChange: (val: quizAns) => any;
};

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

    const propsChange = () => {
        const data = getTemp();
        props.onChange(data);
    };

    const handleChoice = (e, i) => {
        const result = e.target.value;
        const data = getTemp();
        const choiceArray = data.choices.slice();
        choiceArray[i].name = result;
        data.choices = choiceArray;
        setTemp(data);
        console.log(data.choices);
        //propsChange();
        props.onChange(data);
    };

    const handleCorrect = (e, i) => {
        const result = e.target.checked;
        const data = getTemp();
        const choiceArray = data.choices.slice();
        choiceArray[i].isCorrect = result;
        data.choices = choiceArray;
        setTemp(data);
        console.log(data.choices);
        //propsChange();
        props.onChange(data);
    };

    const handleAddChoice = () => {
        const data = { ...getTemp() };
        const choiceArray = data.choices.slice();
        choiceArray.push({ name: 'question', isCorrect: false, order: 0 });
        data.choices = choiceArray;
        setTemp(data);
        console.log(data.choices);
        //propsChange();
        props.onChange(data);
    };

    const handleDeleteChoice = (idx) => {
        const data = { ...getTemp() };
        const choiceArray = data.choices.slice();
        choiceArray.splice(idx, 1);
        data.choices = choiceArray;
        setTemp(data);
        console.log(data.choices);
        //propsChange();
        props.onChange(data);
    };

    const handleSetQuestion = (e) => {
        const data = getTemp();
        data.name = e.target.value;
        setTemp(data);
        console.log(data.name);
        //propsChange();
        props.onChange(data);
    };

    const forms = [];
    for (let i = 0; i < temp.choices.length; i += 2) {
        forms.push(
            <Row>
                {i < temp.choices.length && (
                    <Col key={i} md={6}>
                        <Card className="mb-2">
                            <Form.Group>
                                <Form.Control
                                    className="form-control"
                                    type="text"
                                    placeholder="Type here"
                                    defaultValue={temp.choices[i].name}
                                    onChange={(e) => {
                                        handleChoice(e, i);
                                    }}
                                />
                            </Form.Group>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Control
                                            className="form-control"
                                            type="checkbox"
                                            defaultChecked={
                                                temp.choices[i].isCorrect
                                            }
                                            onChange={(e) => {
                                                handleCorrect(e, i);
                                            }}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <button
                                        type="button"
                                        className=" btn btn-warning"
                                        onClick={(e) => {
                                            handleDeleteChoice(i);
                                        }}>
                                        Delete
                                    </button>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                )}
                {i + 1 < temp.choices.length && (
                    <Col key={i + 1} md={6}>
                        <Card className="mb-2">
                            <Form.Group>
                                <Form.Control
                                    className="form-control"
                                    type="text"
                                    placeholder="Type here"
                                    defaultValue={temp.choices[i + 1].name}
                                    onChange={(e) => {
                                        handleChoice(e, i + 1);
                                    }}
                                />
                            </Form.Group>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Control
                                            className="form-control"
                                            type="checkbox"
                                            defaultChecked={
                                                temp.choices[i + 1].isCorrect
                                            }
                                            onChange={(e) => {
                                                handleCorrect(e, i + 1);
                                            }}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <button
                                        type="button"
                                        className=" btn btn-warning"
                                        onClick={(e) => {
                                            handleDeleteChoice(i + 1);
                                        }}>
                                        Delete
                                    </button>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                )}
            </Row>,
        );
    }

    return (
        <Form>
            <Form.Group>
                <Form.Control
                    className="form-control"
                    type="text"
                    placeholder="Type Your Question"
                    defaultValue={temp.name}
                    onChange={(e) => {
                        handleSetQuestion(e.target.value);
                    }}
                />
            </Form.Group>
            <Container>{forms}</Container>
            <div className="md-12 xs-12">
                <button
                    type="button"
                    className="btn btn-success btn-block"
                    onClick={(e) => {
                        handleAddChoice();
                    }}>
                    +
                </button>
            </div>
        </Form>
    );
};

export default QuestionFrom;
