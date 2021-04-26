import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import { Navbar,Nav, Col, Container, Jumbotron, Row, Form, Card , NavDropdown  } from 'react-bootstrap';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from 'hooks/auth';
import { firebase as firebaseClient } from 'services/firebase/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown ,faCircle, faSquare,faHeart ,faCheck} from '@fortawesome/free-solid-svg-icons';
import { useRootStore } from '../../stores/stores';
import { observer } from 'mobx-react-lite';
import { useEffectOnce, useLifecycles } from 'react-use';

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
export const HostScore = observer((props) => {
  const router = useRouter();
  const HostStore = useRootStore().hostStore;
  const { user } = useAuth();
  const roomID= router.query.id;
  rankTemp.sort(function(a, b) {
      return parseFloat(b.score) - parseFloat(a.score);
  });
  const [rank, setRank] = useState(rankTemp);
  const colors = ["gold","silver","grey"];
 

  const handleClick = async () => {
    await HostStore.UpdatePage(0);
  }
  
  const rows =[];
  for(let i=0;i<rank.length && i<3;i+=1){
      rows.push(
        <Row className="justify-content-center mb-1">
          <Card style={{ width: '500px'}} className={`justify-content-center `}> 
              <Row noGutters className="align-items-center">
              {/* Image */}
              <Col xs={5} md={5}className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faCrown} size="6x" className="mx-auto p-2" color={colors[i]} /> {""}
              </Col>
              {/* Content */}
              <Col xs={7} md={7}>
                <Card.Body>
                  <h6 className="card-title mb-0">
                    <Row>
                      <Col xs={8} md={12}>
                        {rank[i].name}
                      </Col>
                    </Row>
                  </h6>
                  <p className="card-text m-0 text-primary ">score  : {rank[i].score}</p>
                </Card.Body>
              </Col>
            </Row>
                    
          </Card>
        </Row>
      );
  }
  

  return (
  
      <Container className="mt-4">
        <Row className="justify-content-center text-center mb-4">
            TOP PLAYER
         </Row>     
        {rows}
        <Row className="justify-content-center text-center mt-4">
            <button type="button" className="btn btn-primary" style={{ width: '150px'}} onClick ={handleClick}>
                  Next
            </button>
         </Row>     
      </Container>
    
  );
});



export default HostScore;
