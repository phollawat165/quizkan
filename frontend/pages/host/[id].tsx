import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import { Navbar,Nav, Col, Container, Jumbotron, Row, Form, Card , NavDropdown  } from 'react-bootstrap';
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

const tempQuiz ={id: 0,
  title:"asdf" ,
  owner: "asdfghj",
  isPublished: true,
  color: 0,
  count: 4,
  createdAt: "2/2/2",
  updatedAt: null,
  question: [
    {
      id: 0,
      question: "asadaasddddd",
      count:3,
      choices: [
        {id:0,choice:"abc",isCorrect:false},
        {id:1,choice:"bcd",isCorrect:false},
        {id:2,choice:"cde",isCorrect:false},
        {id:3,choice:"def",isCorrect:true},
      ]
      
    },
    {
      id: 1,
      question: "asadaasddddd",
      count:3,
      choices: [
        {id:0,choice:"123",isCorrect:false},
        {id:1,choice:"234",isCorrect:true},
        {id:2,choice:"567",isCorrect:false},
        {id:3,choice:"987",isCorrect:false},
      ]
    },
    {
      id: 2,
      question: "asadaasddddd",
      count:3,
      choices: [
        {id:0,choice:"ฟหก",isCorrect:true},
        {id:1,choice:"ๆไำ",isCorrect:false},
        {id:2,choice:"อออ",isCorrect:false},
        {id:3,choice:"่าี",isCorrect:false},
      ]
    },
    {
      id: 3,
      question: "asadaasddddd",
      count:3,
      choices: [
        {id:0,choice:"ผู้",isCorrect:false},
        {id:1,choice:"ชาย",isCorrect:false},
        {id:2,choice:"หญิง",isCorrect:true},
        {id:3,choice:"   ",isCorrect:false},
      ]
    }
  ]}
export const HostQuiz = (props) => {
  const router = useRouter();
  const { user } = useAuth();
  const quizId = tempQuiz.id;
  const [title, setTitle] = useState(tempQuiz.title);
  const [owner, setOwner] = useState(tempQuiz.owner);
  const [publish, setPublish] = useState(tempQuiz.isPublished);
  const [question, setQuestion] = useState(tempQuiz.question);

  const rows = [];
  for (let i = 0; i < question.length; i += 1){
    rows.push(
        <Card key={question[i].id} className="mt-4">
            <Card.Title>
               Question {i+1} 
            </Card.Title>
            <QuestionFrom key={i} {...question[i]} />
        </Card>
        
    );
  }

  return (
    <HostLayout>
      <Head>
        <title>Host quiz</title>
      </Head>
     
      <Container className="mt-4">
        {rows}
      </Container>
    </HostLayout>
    
  );
};



export default HostQuiz;
