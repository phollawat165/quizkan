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
import style from '../../../components/HostGame/Start.module.scss';
import temp from 'pages/auth/temp';
import { useRootStore } from '../../../stores/stores';
import { observer } from 'mobx-react-lite';
import { useEffectOnce, useLifecycles } from 'react-use';

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
   

export const HostGameplay = observer((props) => {
  const router = useRouter();
  const HostStore = useRootStore().hostStore;
  const WebSocketStore = useRootStore().webSocketStore;
  const { user } = useAuth();
  const [show,setShow]= useState(false);
  const [word,setWord]=useState("Answer");
  const quizId = router.query.id;
  const unANS = tempQuiz();
    for(let i=0;i<unANS.choices.length;i+=1){
      unANS.choices[i].isCorrect = false;
    }
  const [question, setQuestion] = useState(unANS);
  const colors = ["one","two","three","four"];

  const correct = [];
  for(let i=0;i<tempQuiz().choices.length;i+=1){
    if(tempQuiz().choices[i].isCorrect){
      correct.push(i);
    }
  }

  const handleClick = () => {
    if(!show){
        const ANS = tempQuiz();
        setQuestion(ANS);
        setShow(true);
        setWord("next");
        WebSocketStore.socket.emit('send_correct_choices', {
          chatRoomId: quizId,
          choices: correct
        });
    }
    else{
        router.push(`/host/${quizId}/score`);
    }
  }
  useLifecycles(
    () => {
      WebSocketStore.connect();
      // registers
    },
    () => {
      // unregister
      WebSocketStore.socket.off('recieve_message');
      // shutdown
      WebSocketStore.close();
    }
  );
 
  const sendChoices = () => {
    WebSocketStore.socket.emit('send_number_of_choices', {
        chatRoomId: quizId,
        question: HostStore.question,
        choices: question.choices.length
      });
  };
  sendChoices();
  const forms =[];
  for (let i = 0; i < question.choices.length; i += 2){
    forms.push(
        <Row>
        {i < question.choices.length && (
            <Col  key={i} md={6}>
              <Card className={`mb-2 ${style[colors[i%4]]} `}>
                <Row noGutters className="h-100">
                  {/* Content */}
                  <Col md={1} xs={1}></Col>
                  <Col className={`d-flex align-items-center text-center ${style["text"]}`} >{question.choices[i].choice}</Col>
                  {question.choices[i].isCorrect && (<Col className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faCheck} size="6x" className="mx-auto" color="white" /> {""}
                  </Col>)}
                </Row>
              </Card>
            </Col>
        )}
        {i+1 < question.choices.length && (
            <Col  key={i+1} md={6}>
              <Card className={`mb-2 ${style[colors[(i+1)%4]]}`}>
              <Row noGutters className="h-100">
                  {/* Content */}
                    <Col md={1} xs={1}></Col>
                    <Col className={`d-flex align-items-center text-center ${style["text"]}`} >{question.choices[i+1].choice} </Col>
                    {question.choices[i+1].isCorrect && (<Col className="d-flex align-items-center">
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
    <DefaultLayout >
      <Head>
        <title>Host Game Play</title>
      </Head>
     
      <Container className="mt-4">
         <Row>
            <button type="button" className="btn btn-primary" onClick ={handleClick}>
                  {word}
            </button>
        </Row>
        
        <Card className="mt-4">
          <Card.Title>
             Question {HostStore.question + 1}
          </Card.Title>
          <Row className = "mb-3 ml-2">
            {question.question}
          </Row>
          {forms}
        </Card>

      </Container>
    </DefaultLayout>
    
  );
});



export default HostGameplay;
