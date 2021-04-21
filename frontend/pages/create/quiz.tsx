import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import { Col, Container, Jumbotron, Row, Form, Card ,Nav,Navbar} from 'react-bootstrap';
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
    count: 0,
    createdAt: "2/2/2",
    updatedAt: null,
    question: [
      {
        id:0,
        question: null,
        count:0,
        choices: [
          {id:0,choice:null,isCorrect:false},
        ]
        
      }
    ]}
    export const EditQuiz = (props) => {
      const router = useRouter();
      const quizId = tempQuiz.id;
      const [title, setTitle] = useState(tempQuiz.title);
      const [owner, setOwner] = useState(tempQuiz.owner);
      const [publish, setPublish] = useState(tempQuiz.isPublished);
      const [question, setQuestion] = useState(tempQuiz.question);
      const [count, setCount] = useState(tempQuiz.count);
      const handleDeleteQuestion = idx => {
        const array = question.slice();
        array.splice(idx, 1);
        setQuestion(array);
      }
      const handleAddQuestion = () => {
        const array = question.slice();
        array.push(
            {
              id: count+1,
              question: null,
              count:0,
              choices: [{id:0,choice:null,isCorrect:false}]
            }
        );
        setCount(count+1);
        setQuestion(array);
      }
    
      const rows = [];
      for (let i = 0; i < question.length; i += 1){
        rows.push(
            <Card key={question[i].id} className="mt-4">
                <Card.Title>
                   Question {i+1} 
                    <button type="button" className="btn btn-danger float-right" 
                    onClick={(e) =>{ handleDeleteQuestion(i)}}
                    >
                      Delete
                    </button>
                </Card.Title>
                <QuestionFrom key={question[i].id} {...question[i]} />
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
                <button type="button" className="btn btn-primary" onClick={handleAddQuestion}>
                      Add Question
                </button>
            </Row>
    
            {rows}
          </Container>
          <Navbar
          bg="light"
          variant="light"
          expand="md"
          fixed="bottom"
          className="d-md-none"
          style={{ height: '2.5rem' }}>
          <Nav.Link
            className="justify-content-center mx-auto position-relative"
            style={{ bottom: '2.75rem' }}>
            <img
              role="button"
              src="/images/search.svg"
              width="100px"
              height="100px"
              className="stretched-link mb-10"
              onClick={handleAddQuestion}
            />
          </Nav.Link>
        </Navbar>
        </DefaultLayout>
      );
    };
    



export default EditQuiz;
