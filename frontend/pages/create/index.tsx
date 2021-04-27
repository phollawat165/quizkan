import { Col, Row, Container } from 'react-bootstrap';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.scss';
import DefaultLayout from '../../layouts/Default';
import QuizGrid from '../../components/CreateQuizs/Grid';
import QuizPagination from '../../components/CreateQuizs/Pagination';
import axios from 'axios';
import { useEffectOnce } from 'react-use';
import { useAuth } from 'hooks/auth';
import Spinner from 'components/Admin/Spinner';

export const createGame: React.FC<any> = (props) => {
    const router = useRouter();

    const { loading } = useAuth();
    const [dirty, setDirty] = useState(true);

    // Data
    const [quizs, setQuizs] = useState([]);
    useEffect(() => {
        if (dirty && !loading) {
            axios
                .get('/quizzes')
                .then(({ data }) => {
                    setQuizs(data);
                })
                .catch(({ err }) => {
                    console.log(err);
                })
                .finally(() => {
                    setDirty(false);
                });
        }
    }, [loading, dirty]);
    // Pagination state
    const [pageLen, setPageLen] = useState(1);
    const page = (Number.parseInt(router.query.page as string) || 1) - 1;
    const perPage = 4;
    // On page change
    const goToPage = (e: React.MouseEvent<HTMLElement>, pageNo: number) => {
        e.preventDefault();
        if (pageNo >= 0 && pageNo <= pageLen)
            router.push(
                { href: '/create', query: { ...router.query, page: pageNo } },
                undefined,
                {
                    shallow: true,
                },
            );
    };

    const handleDelete = (idx) => {
        console.log('Deleting ', idx);
        const newQuizs = [];
        for (let i = 0; i < quizs.length; i++) {
            if (quizs[i].id != idx) {
                newQuizs.push(quizs[i]);
            }
        }
        setQuizs(newQuizs);
    };

    // Update page length
    useEffect(() => {
        setPageLen(Math.ceil(quizs.length / perPage));
    }, [quizs]);
    // Render
    return (
        <DefaultLayout>
            <Container>
                <Row className="mt-4 mb-4">
                    <Col xs={12} md={12}>
                        <button
                            type="button"
                            className="my-2 btn btn-dark float-right"
                            onClick={() => {
                                router.push('/create/quiz');
                            }}>
                            Create
                        </button>
                    </Col>
                </Row>
                <QuizGrid
                    quizs={quizs.slice(page * perPage, (page + 1) * perPage)}
                    onDelete={handleDelete}
                />

                <QuizPagination
                    page={page}
                    pageLength={pageLen}
                    onPageChange={goToPage}
                />
            </Container>
        </DefaultLayout>
    );
};

export default createGame;
