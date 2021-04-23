import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import { Navbar,Nav, Col, Container, Jumbotron, Row, Form, Card , NavDropdown  } from 'react-bootstrap';
import HostLayout from '../../../layouts/Host';
import QuestionFrom from '../../../components/HostGame/Form';
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

const rankTemp = [{name: "ben", score :"1"},
              {name: "asd", score :"10"},
              {name: "qwer", score :"4"},
              {name: "mon", score :"2"},
              {name: "ack", score :"9"},
              {name: "nak", score :"9"},
              {name: "zac", score :"0"},
              {name: "brr", score :"5"},
              {name: "yuo", score :"7"},
              ];
export const PlayerScore = (props) => {
  const router = useRouter();
  const { user } = useAuth();
  rankTemp.sort(function(a, b) {
      return parseFloat(b.score) - parseFloat(a.score);
  });
  const [rank, setRank] = useState(rankTemp);
  
  const rows =[];
  for(let i=0;i<rank.length && i<5;i+=1){
      rows.push(
        <Row> {rank[i].name} score: {rank[i].score}</Row>
      );
  }
  

  return (
    <HostLayout>
      <Head>
        <title>Player Score</title>
      </Head>
     
      <Container className="mt-4">
        {rows}
      </Container>
    </HostLayout>
    
  );
};



export default PlayerScore;
