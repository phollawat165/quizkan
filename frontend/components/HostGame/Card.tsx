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

export type QuizCardProps = Partial<quiz>;

export const QuizCard: React.FC<QuizCardProps> = (props) => {
    const router = useRouter();
    const colors = ['one', 'two', 'three', 'four'];
    const icons = [faStar, faCircle, faSquare, faHeart];
    return (
        <Card
            className={`mb-3 ${style[colors[props.color]]}`}
            onClick={() => {
                router.push(`/host/${props.id}`);
            }}>
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
                            <Row className={style['text']}>{props.title}</Row>
                            <Row className={`${style['text']}`}>
                                {dayjs(props.createdAt).fromNow()}
                            </Row>
                        </h6>
                    </Card.Body>
                </Col>
            </Row>
        </Card>
    );
};

export default QuizCard;
