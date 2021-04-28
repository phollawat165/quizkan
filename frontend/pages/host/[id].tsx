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
import HostLayout from '../../layouts/Host';
import QuestionFrom from '../../components/HostGame/Form';
import Image from 'react-bootstrap/Image';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../components/Navigation/NavBar.module.scss';
import { useAuth } from 'hooks/auth';
import { firebase as firebaseClient } from 'services/firebase/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useEffectOnce } from 'react-use';

export const HostQuiz = (props) => {
    const router = useRouter();
    const [question, setQuestion] = useState(null);
    const [temp, setTemp] = useState(null);
    const [order, setOrder] = useState(null);
    const [id, setId] = useState(router.query.id);
    const [count, setCount] = useState(0);

    useEffectOnce(() => {
        axios
            .get(`/quizzes/${id}`)
            .then(({ data }) => {
                setTemp(data);
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

    const rows = [];
    for (let i = 0; i < count; i += 1) {
        rows.push(
            <Card key={i} className="mt-4">
                <Card.Title>Question {i + 1}</Card.Title>
                {temp != null && (
                    <QuestionFrom key={i} {...temp.questions[i]} />
                )}
            </Card>,
        );
    }

    return (
        <HostLayout>
            <Head>
                <title>Host quiz</title>
            </Head>

            <Container className="mt-2">
                {temp === null ? (
                    'Loading'
                ) : (
                    <Container className="mt-2">{rows}</Container>
                )}
            </Container>
        </HostLayout>
    );
};

export default HostQuiz;
