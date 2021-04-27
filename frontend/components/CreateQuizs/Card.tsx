import Image from 'next/image';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faStar,
    faCircle,
    faSquare,
    faHeart,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import quiz from '../../models/quiz/quiz';
import style from './CreateQuiz.module.scss';
import dayjs from 'dayjs';
import axios from 'axios';

export type QuizCardProps = Partial<quiz> & { onDelete: (idx: number) => any };

export const QuizCard: React.FC<QuizCardProps> = (props) => {
    const router = useRouter();
    const colors = ['one', 'two', 'three', 'four'];
    const icons = [faStar, faCircle, faSquare, faHeart];
    const handleDelete = (idx) => {
        axios
            .delete(`/quizzes/${props.id}`)
            .then(({ data }) => {
                props.onDelete(idx);
            })
            .catch(({ err }) => {
                console.log(err);
            });
    };
    return (
        <a className={style['custom-a']} onClick={(e) => e.preventDefault()}>
            <Card className={`mb-3 ${style[colors[props.color]]}`}>
                <Row noGutters className="h-100">
                    <Col xs={4} md={4} className="d-flex align-items-center">
                        <FontAwesomeIcon
                            icon={icons[props.color]}
                            size="6x"
                            className="mx-auto"
                            color="white"
                        />{' '}
                        {''}
                    </Col>
                    {/* Content */}
                    <Col
                        xs={7}
                        md={7}
                        className={`${style['card-details-column']} ml-2`}>
                        <Card.Body>
                            <h6 className="card-title mb-0">
                                <Row className={style['text']}>
                                    {props.title}
                                </Row>
                                <Row className={`${style['text']}`}>
                                    {dayjs(props.createdAt).fromNow()}
                                </Row>
                                <Row noGutters className="mt-2">
                                    <Col xs={4} md={3}>
                                        <button
                                            type="button"
                                            className="my-2 btn btn-light"
                                            onClick={() => {
                                                router.push(
                                                    `/edit/${props.id}`,
                                                );
                                            }}>
                                            Edit
                                        </button>
                                    </Col>
                                    <Col xs={4} md={3}>
                                        <button
                                            type="button"
                                            className="my-2 btn btn-light"
                                            onClick={() => {
                                                handleDelete(props.id);
                                            }}>
                                            Delete
                                        </button>
                                    </Col>
                                </Row>
                            </h6>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </a>
    );
};

export default QuizCard;
