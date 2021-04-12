import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import { Col, Container, Jumbotron, Row, Form, Card } from 'react-bootstrap';
import DefaultLayout from '../../layouts/Default';
import QuestionFrom from '../../components/CreateQuizs/Form';
import Image from 'react-bootstrap/Image';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';

const tempQuiz ={id: 0,
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
    ]}
export const EditQuiz = (props) => {
  const router = useRouter();
  const quizId = tempQuiz.id;
  const [title, setTitle] = useState(tempQuiz.title);
  const [owner, setOwner] = useState(tempQuiz.owner);
  const [publish, setPublish] = useState(tempQuiz.isPublished);
  const [question, setQuisetion] = useState(tempQuiz.question);

 

  const choices = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ];

  const rows = [];
  for (let i = 0; i < question.length; i += 1){
    rows.push(
        <Card className="mt-4">
            <Card.Title>
               Question {i+1} 
                <button type="button" className="btn btn-danger float-right" >
                  Delete
                </button>
            </Card.Title>
            <QuestionFrom key={i} {...question[i]} />
        </Card>
        
    );
  }

  return (
    <DefaultLayout>
      <Head>
        <title>Edit Quiz </title>
      </Head>
      
      <Container className="mt-2">
        <Row>
            <button type="button" className="btn btn-primary" >
                  Add Question
            </button>
        </Row>

        {rows}
      </Container>
    </DefaultLayout>
  );
};



export default EditQuiz;
