import React from 'react';
import { Col, Row } from 'react-bootstrap';
import quiz from '../../models/quiz/quiz';
import QuizCard from './Card';

export type QuizGridProps = {
    quizs: Partial<quiz>[];
    onDelete: (idx: number) => any;
};

export const QuizGrid: React.FC<QuizGridProps> = ({ quizs, ...props }) => {
    const rows = [];
    for (let i = 0; i < quizs.length; i += 1) {
        quizs[i].color = i % 4;
    }
    for (let i = 0; i < quizs.length; i += 2) {
        rows.push(
            <Row key={i}>
                {i < quizs.length && (
                    <Col md={6}>
                        <QuizCard
                            onDelete={props.onDelete}
                            key={i}
                            {...quizs[i]}
                        />
                    </Col>
                )}
                {i + 1 < quizs.length && (
                    <Col md={6}>
                        <QuizCard
                            onDelete={props.onDelete}
                            key={i + 1}
                            {...quizs[i + 1]}
                        />
                    </Col>
                )}
            </Row>,
        );
    }
    return <>{rows}</>;
};

export default QuizGrid;
