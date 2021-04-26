import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import {
    Col,
    Container,
    Jumbotron,
    Row,
    Form,
    Card,
    Nav,
    Navbar,
} from 'react-bootstrap';
import DefaultLayout from '../../layouts/Default';
import QuestionFrom from '../../components/CreateQuizs/Form';
import Image from 'react-bootstrap/Image';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';

const tempQuiz = {
    id: 0,
    title: 'asdf',
    owner: 'asdfghj',
    isPublished: true,
    color: 0,
    count: 4,
    createdAt: '2/2/2',
    updatedAt: null,
    question: [
        {
            id: 0,
            question: 'asadaasddddd',
            count: 3,
            choices: [
                { id: 0, choice: 'abc', isCorrect: false },
                { id: 1, choice: 'bcd', isCorrect: false },
                { id: 2, choice: 'cde', isCorrect: false },
                { id: 3, choice: 'def', isCorrect: true },
            ],
        },
        {
            id: 1,
            question: 'asadaasddddd',
            count: 3,
            choices: [
                { id: 0, choice: '123', isCorrect: false },
                { id: 1, choice: '234', isCorrect: true },
                { id: 2, choice: '567', isCorrect: false },
                { id: 3, choice: '987', isCorrect: false },
            ],
        },
        {
            id: 2,
            question: 'asadaasddddd',
            count: 3,
            choices: [
                { id: 0, choice: 'ฟหก', isCorrect: true },
                { id: 1, choice: 'ๆไำ', isCorrect: false },
                { id: 2, choice: 'อออ', isCorrect: false },
                { id: 3, choice: '่าี', isCorrect: false },
            ],
        },
        {
            id: 3,
            question: 'asadaasddddd',
            count: 3,
            choices: [
                { id: 0, choice: 'ผู้', isCorrect: false },
                { id: 1, choice: 'ชาย', isCorrect: false },
                { id: 2, choice: 'หญิง', isCorrect: true },
                { id: 3, choice: '   ', isCorrect: false },
            ],
        },
    ],
};
export const EditQuiz = (props) => {
    const router = useRouter();
    const quizId = tempQuiz.id;
    const [title, setTitle] = useState(tempQuiz.title);
    const [owner, setOwner] = useState(tempQuiz.owner);
    const [publish, setPublish] = useState(tempQuiz.isPublished);
    const [question, setQuestion] = useState(tempQuiz.question);
    const [count, setCount] = useState(tempQuiz.count);
    const handleDeleteQuestion = (idx) => {
        const array = question.slice();
        array.splice(idx, 1);
        setQuestion(array);
    };
    const handleAddQuestion = () => {
        const array = question.slice();
        array.push({
            id: count + 1,
            question: null,
            count: 0,
            choices: [{ id: 0, choice: null, isCorrect: false }],
        });
        setCount(count + 1);
        setQuestion(array);
    };

    const rows = [];
    for (let i = 0; i < question.length; i += 1) {
        rows.push(
            <Card key={question[i].id} className="mt-4">
                <Card.Title>
                    Question {i + 1}
                    <button
                        type="button"
                        className="btn btn-danger float-right"
                        onClick={(e) => {
                            handleDeleteQuestion(i);
                        }}>
                        Delete
                    </button>
                </Card.Title>
                <QuestionFrom key={question[i].id} {...question[i]} />
            </Card>,
        );
    }

    return (
        <DefaultLayout>
            <Head>
                <title>Edit Quiz </title>
            </Head>

            <Container className="mt-2">{rows}</Container>
            <Navbar
                bg="light"
                variant="light"
                expand="md"
                fixed="bottom"
                style={{ height: '2.5rem' }}>
                <Nav.Link
                    className="justify-content-center mx-auto position-relative"
                    style={{ bottom: '2.75rem' }}>
                    <button
                        type="button"
                        className="btn btn-primary mr-2"
                        style={{ width: '150px' }}
                        onClick={handleAddQuestion}>
                        Add Question
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary ml-2 "
                        style={{ width: '100px' }}>
                        Save
                    </button>
                </Nav.Link>
            </Navbar>
        </DefaultLayout>
    );
};

export default EditQuiz;
