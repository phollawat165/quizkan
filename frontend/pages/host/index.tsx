import { Col, Row, Container } from 'react-bootstrap';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.scss';
import DefaultLayout from '../../layouts/Default';
import QuizGrid from '../../components/HostGame/Grid';
import QuizPagination from '../../components/HostGame/Pagination';
import Spinner from 'components/Admin/Spinner';
import { useAuth } from 'hooks/auth';
import axios from 'axios';

export const hostGame: React.FC<any> = (props) => {
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

    // Update page length
    useEffect(() => {
        setPageLen(Math.ceil(quizs.length / perPage));
    }, [quizs]);
    // Render
    return (
        <DefaultLayout>
            <Head>
                <title>Host Game</title>
            </Head>
            <Container className="py-4">
                <QuizGrid
                    quizs={quizs.slice(page * perPage, (page + 1) * perPage)}
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

export default hostGame;
