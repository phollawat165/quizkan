import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import { Navbar,Nav, Col, Container, Jumbotron, Row, Form, Card , NavDropdown  } from 'react-bootstrap';
import DefaultLayout from '../../layouts/Default';
import QuestionFrom from '../../components/HostGame/Form';
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
import HostWait from '../../components/HostGamePlay/wait';
import HostGame from '../../components/HostGamePlay/game';
import HostScore from '../../components/HostGamePlay/score';
import temp from 'pages/auth/temp';
import { useRootStore } from '../../stores/stores';
import { observer } from 'mobx-react-lite';
import { useEffectOnce, useLifecycles } from 'react-use';

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
      ]
    }
  ]}

export const HostGameplay = observer((props) => {
  const router = useRouter();
  const HostStore = useRootStore().hostStore;
  const { user } = useAuth();
  const [page,setPage] = useState(HostStore.page);
  const WebSocketStore = useRootStore().webSocketStore;


  (async () => {
    await HostStore.UpdateQuestions(tempQuiz)
  })();
  

  useEffect(() => {
    setPage(HostStore.page);
  }, [HostStore.page]);
  

  
  return (
    <DefaultLayout >
      <Head>
        <title>Host Game Play</title>
      </Head>
      {page==0 && (<HostWait/> )}
      {page==1 && (<HostGame/> )}
      {page==2 && (<HostScore/> )}
    </DefaultLayout>
    
  );
});



export default HostGameplay;
