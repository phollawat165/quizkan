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
import { useEffectOnce } from 'react-use';

export const EditQuiz = (props) => {
    const router = useRouter();
    const [question, setQuestion] = useState(null);
    const [order, setOrder] = useState(null);
    const [id, setId] = useState(null);
    const [temp, setTemp] = useState(null);
    const [count, setCount] = useState(0);

    useEffectOnce(() => {
        const payload = {
            isPublished: true,
            order: 1,
            title: 'Test Quiz name',
            description: 'test',
            questions: [
                {
                    order: 1,
                    name:
                        'Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl.',
                    choices: [
                        {
                            isCorrect: false,
                            order: 1,
                            name: 'empty',
                        },
                    ],
                },
            ],
        };

        axios
            .post('/quizzes', payload)
            .then(({ data }) => {
                /*data.order = data.questions.lenght;
            setOrder(data.order);
            setId(data.id);
            for (let i = 0; i < data.order; i += 1) {
                data.questions[i].newOrder = i;
            }*/
                setTemp(data);
                console.log(data.questions);
                //console.log(temp);
            })
            .catch((err) => {
                if (err.response) {
                    console.error(err.response);
                } else {
                    console.error('Something went wrong');
                }
            });
    });
    const getTemp = () => {
        return temp;
    };
    useEffect(() => {
        if (temp != null) {
            const data = getTemp();
            console.log(data);
            setCount(temp.questions.length);
        }
    }, [temp]);

    const handleChange = (val, idx) => {
        const data = getTemp();
        const array = data.questions.slice();
        array[idx] = val;
        data.questions = array;
        setTemp(data);
        setCount(array.length);
        console.log(temp);
        console.log('from child');
        handleAddQuestion();
        handleDeleteQuestion(count - 1);
    };

    const rows = [];
    for (let i = 0; i < count; i += 1) {
        rows.push(
            <Card key={i} className="mt-4">
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
                {temp != null && (
                    <QuestionFrom
                        key={i}
                        onChange={(val) => {
                            handleChange(val, i);
                        }}
                        {...temp.questions[i]}
                    />
                )}
            </Card>,
        );
    }

    const handleDeleteQuestion = (idx) => {
        const data = getTemp();
        const array = data.questions.slice();
        array.splice(idx, 1);
        data.questions = array;
        setTemp(data);
        setCount(array.length);
        console.log(temp);
    };

    const handleAddQuestion = () => {
        const data = getTemp();
        const array = data.questions.slice();
        array.push({
            name: 'question name',
            order: 1,
            choices: [{ name: 'question', isCorrect: false, order: 0 }],
        });
        data.questions = array;
        setTemp(data);
        setCount(array.length);
        console.log(temp);
    };
    const handleSave = () => {
        const payload = getTemp();
        console.log(payload);
        axios.patch(`/quizzes/${payload.id}`, payload).then(({ data }) => {
            router.push(`/create`);
        });
    };

    return (
        <DefaultLayout>
            <Head>
                <title>Edit Quiz </title>
            </Head>

            <Container className="mt-2">
                {temp === null ? (
                    'Loading'
                ) : (
                    <Container className="mt-2">{rows}</Container>
                )}
            </Container>
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
                        style={{ width: '100px' }}
                        onClick={handleSave}>
                        Save
                    </button>
                </Nav.Link>
            </Navbar>
        </DefaultLayout>
    );
};

export default EditQuiz;
