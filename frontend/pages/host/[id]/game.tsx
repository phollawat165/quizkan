import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import { Navbar,Nav, Col, Container, Jumbotron, Row, Form, Card , NavDropdown  } from 'react-bootstrap';
import HostLayout from '../../../layouts/Host';
import QuestionFrom from '../../../components/HostGame/GameForm';
import Image from 'react-bootstrap/Image';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../components/Navigation/NavBar.module.scss';
import { useAuth } from 'hooks/auth';
import { firebase as firebaseClient } from 'services/firebase/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar ,faCircle, faSquare,faHeart ,faCheck} from '@fortawesome/free-solid-svg-icons';
import style from '../../../components/HostGame/Start.module.scss';

const tempQuiz =
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
      
    };

export const HostGameplay = (props) => {
  const router = useRouter();
  const { user } = useAuth();
  const [show,setShow]= useState(false);
  const [word,setWord]=useState("Answer");
  const quizId = tempQuiz.id;
  
  
  
  const c = tempQuiz.choices.slice();
              
  for (let i = 0; i < c.length; i += 1){
    c[i].isCorrect = false;
  }
  const [choices,setChoices]=useState(c);


  const handleClick = () => {
    if(!show){
        const cc = tempQuiz.choices.slice();
        for (let i = 0; i < cc.length; i += 1){
            cc[i].isCorrect = true;
          }
        setChoices(cc);
        setShow(true);
        setWord("next");
    }
    else{
        router.push(`/host/${quizId}/wait`);
    }
  }
  const temp = [];
  temp.push(
    <Card className="mt-4">
        <Card.Title>
        Question {quizId+1} 
        </Card.Title>
        <QuestionFrom {...choices} />
    </Card>
  );

  const colors = ["one","two","three","four"]
  const icons = [faStar ,faCircle, faSquare,faHeart];
  const forms =[];
  for (let i = 0; i < choices.length; i += 2){
    forms.push(
        <Row>
        {i < choices.length && (
            <Col  key={i} md={6}>
              <Card className={`mb-2 ${style[colors[i%4]]} `}>
                <Row noGutters className="h-100">
                  {/* Content */}
                  <Col md={1} xs={1}></Col>
                  <Col className={`d-flex align-items-center text-center ${style["text"]}`} >{choices[i].choice}</Col>
                  {choices[i].isCorrect && (<Col className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faCheck} size="6x" className="mx-auto" color="white" /> {""}
                  </Col>)}
                </Row>
              </Card>
            </Col>
        )}
        {i+1 < choices.length && (
            <Col  key={i+1} md={6}>
              <Card className={`mb-2 ${style[colors[(i+1)%4]]}`}>
              <Row noGutters className="h-100">
                  {/* Content */}
                    <Col md={1} xs={1}></Col>
                    <Col className={`d-flex align-items-center text-center ${style["text"]}`} >{choices[i+1].choice} </Col>
                    {choices[i+1].isCorrect && (<Col className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faCheck} size="6x" className="mx-auto" color="white" /> {""}
                    </Col>)}

                </Row>
              </Card>
          </Col>
        )}
      </Row>
    );
  }
  return (
    <HostLayout>
      <Head>
        <title>Host Game Play</title>
      </Head>
     
      <Container className="mt-4">
         <Row>
            <button type="button" className="btn btn-primary" onClick ={handleClick}>
                  {word}
            </button>
        </Row>
       {forms}
      </Container>
    </HostLayout>
    
  );
};



export default HostGameplay;
