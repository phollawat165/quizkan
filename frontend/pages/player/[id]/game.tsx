import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import { Navbar,Nav, Col, Container, Jumbotron, Row, Form, Card , NavDropdown  } from 'react-bootstrap';
import DefaultLayout from '../../../layouts/Default';
import QuestionFrom from '../../../components/HostGame/Form';
import Image from 'react-bootstrap/Image';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../components/Navigation/NavBar.module.scss';
import { useAuth } from 'hooks/auth';
import { firebase as firebaseClient } from 'services/firebase/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar ,faCircle, faSquare,faHeart ,faCheck} from '@fortawesome/free-solid-svg-icons';
import style from '../../../components/Home/Home.module.scss';
import temp from 'pages/auth/temp';
import { useRootStore } from '../../../stores/stores';
import { observer } from 'mobx-react-lite';

const tempQuiz = () =>{
   return  {
    id: 0,
    question: "asadaasddddd",
    count:3,
    choices: [
      {id:0,choice:"abc",isCorrect:false},
      {id:1,choice:"bcd",isCorrect:false},
      {id:2,choice:"cde",isCorrect:true},
      {id:3,choice:"def",isCorrect:false},
    ]
  };
}
   

export const PlayerGameplay = observer((props) => {
  const router = useRouter();
  const { user } = useAuth();
  const playerStore = useRootStore().playerStore;
  const [question, setQuestion] = useState(tempQuiz());
  const roomID= router.query.id;
  const colors = ["one","two","three","four"];
  const icons = [faStar ,faCircle, faSquare,faHeart];
  const [score,setScore]=useState(playerStore.totalScore);
  const [currentTime,serCurrentTime]=useState(123);


  const handleClick = async (idx) => {
    await playerStore.setTimer(currentTime);
    await playerStore.setChoice(idx);
    router.push(`/player/${roomID}/score`);
  }
  const forms =[];
  for (let i = 0; i < question.choices.length; i += 2){
    forms.push(
        <Row>
        {i < question.choices.length && (
            <Col  key={i} md={6}>
              <Card className={`mb-2 ${style[colors[i%4]]} `} onClick={() => {handleClick(i)}}>
                <Row noGutters className="h-100">
                  {/* Content */}
            
                  <Col className="d-flex align-items-center">
                        <FontAwesomeIcon icon={icons[i%4]} size="6x" className="mx-auto" color="white" /> {""}
                  </Col>
                </Row>
              </Card>
            </Col>
        )}
        {i+1 < question.choices.length && (
            <Col  key={i+1} md={6}>
              <Card className={`mb-2 ${style[colors[(i+1)%4]]}`}  onClick={() => {handleClick(i+1)}}>
                <Row noGutters className="h-100">
                  {/* Content */}
          
                  <Col className="d-flex align-items-center">
                        <FontAwesomeIcon icon={icons[(i+1)%4]} size="6x" className="mx-auto" color="white" /> {""}
                  </Col>
                </Row>
              </Card>
            </Col>
        )}
      </Row>
    );
  }

  return (
    <DefaultLayout >
      <Head>
        <title>Player Game Play</title>
      </Head>
     
      <Container className="mt-4">
        <Row className ='mb-3'>Your Score : {score}</Row>
        <Container >
            {forms}
        </Container>
      </Container>
    </DefaultLayout>
    
  );
});



export default PlayerGameplay;
