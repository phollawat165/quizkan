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
import HostWait from '../../../components/HostGamePlay/wait';
import HostGame from '../../../components/HostGamePlay/game';
import HostScore from '../../../components/HostGamePlay/score';
import temp from 'pages/auth/temp';
import { useRootStore } from '../../../stores/stores';
import { observer } from 'mobx-react-lite';
import { useEffectOnce, useLifecycles } from 'react-use';



export const HostGameplay = observer((props) => {
  const router = useRouter();
  const HostStore = useRootStore().hostStore;
  const { user } = useAuth();
  const [page,setPage] = useState(HostStore.page);
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
