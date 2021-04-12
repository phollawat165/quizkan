import { Col, Row ,Container} from 'react-bootstrap';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.scss';
import DefaultLayout from '../../layouts/Default';
import QuizGrid from '../../components/CreateQuizs/Grid';
import QuizPagination from '../../components/CreateQuizs/Pagination';


const tempQuizs = [
  {id: 0,
    title:"asdf" ,
    owner: "asdfghj",
    isPublished: true,
    color: 0,
    createdAt: "2/2/2",
    updatedAt: null,
    question: [
      {
        question: "asadaasddddd",
        count: 4,
        choice: ["abc","bce","cef","efg"],
        correct: [2]
      },
      {
        question: "asadaasddddd",
        count: 4,
        choice: ["abc","bce","cef","efg"],
        correct: [2]
      },
      {
        question: "asadaasddddd",
        count: 4,
        choice: ["abc","bce","cef","efg"],
        correct: [3]
      },
      {
        question: "asadaasddddd",
        count: 4,
        choice: ["abc","bce","cef","efg"],
        correct: [1]
      }
    ]},
    {id: 1,
      title:"qwert" ,
      owner: "asdfghj",
      isPublished: true,
      color: 0,
      createdAt: "2/2/2",
      updatedAt: null,
      question: [
        {
          question: "asadaasddddd",
          count: 4,
          choice: ["abc","bce","cef","efg"],
          correct: [2]
        },
        {
          question: "asadaasddddd",
          count: 4,
          choice: ["abc","bce","cef","efg"],
          correct: [2]
        },
        {
          question: "asadaasddddd",
          count: 4,
          choice: ["abc","bce","cef","efg"],
          correct: [2]
        },
        {
          question: "asadaasddddd",
          count: 4,
          choice: ["abc","bce","cef","efg"],
          correct: [2]
        }
      ]}
      ,
    {id: 2,
      title:"aasad" ,
      owner: "asdfghj",
      isPublished: true,
      color: 0,
      createdAt: "2/2/2",
      updatedAt: null,
      question: [
        {
          question: "asadaasddddd",
          count: 4,
          choice: ["abc","bce","cef","efg"],
          correct: [2]
        }
      ]},
      {id: 3,
        title:"asdsdsdssfsfd" ,
        owner: "asdfghj",
        isPublished: true,
        color: 0,
        createdAt: "2/2/2",
        updatedAt: null,
        question: [
          {
            question: "asadaasddddd",
            count: 4,
            choice: ["abc","bce","cef","efg"],
            correct: [2]
          }
        ]},
        {id: 4,
          title:"zxccv" ,
          owner: "asdfghj",
          isPublished: true,
          color: 0,
          createdAt: "2/2/2",
          updatedAt: null,
          question: [
            {
              question: "asadaasddddd",
              count: 4,
              choice: ["abc","bce","cef","efg"],
              correct: [2]
            }
          ]}
];


export const createGame: React.FC<any> = (props) => {
  
  const router = useRouter();
  // Data
  const [quizs, setQuizs] = useState(tempQuizs|| []);
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
        }
      );
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
                router.push('/jobs/register');
              }}>
              Create
            </button>
          </Col>
        </Row>
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
  

  
  export default createGame;
  