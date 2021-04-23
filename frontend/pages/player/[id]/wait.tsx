import { Col, Row ,Container} from 'react-bootstrap';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.scss';
import DefaultLayout from '../../../layouts/Default';
import QuizGrid from '../../../components/HostGame/Grid';
import QuizPagination from '../../../components/HostGame/Pagination';


export const hostGame: React.FC<any> = (props) => {
  const router = useRouter();
  const [joinCount, setJoinCount] = useState(0);
  const [roomID,setRoomID] = useState(router.query.id);
  const [start,serStart]=useState(false);
  // Render
    return (
      <DefaultLayout>
        <Head>
          <title>Host Game Wait</title>
        </Head>
        <Container className="mt-4">
          <Row>
              Room ID : {router.query.id}
         </Row>
         <Row>
            Wait for Host
         </Row>     
        </Container>
      
      </DefaultLayout>
    );
  };
  

  
  export default hostGame;
  
