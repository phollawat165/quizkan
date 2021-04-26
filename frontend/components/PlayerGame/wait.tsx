import { Col, Row ,Container} from 'react-bootstrap';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useRootStore } from '../../stores/stores';
import { observer } from 'mobx-react-lite';
import { useEffectOnce, useLifecycles } from 'react-use';

export const  PlayerWait: React.FC<any> = observer((props) => {
  const router = useRouter();
  const [roomID,setRoomID] = useState(router.query.id);
  const [start,serStart]=useState(false);
  const playerStore = useRootStore().playerStore;

  const handleClick = async () => {
    await playerStore.UpdatePage(1);
  }

  // Render
    return (
     
        <Container className="mt-4">
          <Row className="justify-content-center text-center mb-4">
              Room ID : {router.query.id}
         </Row>
         <Row className="justify-content-center text-center mb-4" >
            Wait for Host
         </Row> 
         <Row  className="justify-content-center mb-4">
            <button type="button" className="btn btn-primary" onClick ={handleClick}>
                  check
            </button>
         </Row>         
        </Container>
  
    );
  });
  

  
  export default PlayerWait;
  
