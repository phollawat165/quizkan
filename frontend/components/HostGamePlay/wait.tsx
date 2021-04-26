import { Col, Row ,Container} from 'react-bootstrap';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useRootStore } from '../../stores/stores';
import { observer } from 'mobx-react-lite';
import { useEffectOnce, useLifecycles } from 'react-use';

export const HostWait: React.FC<any> = observer((props) => {
  const router = useRouter();
  const HostStore = useRootStore().hostStore;
  const [joinCount, setJoinCount] = useState(0);
  const roomID= router.query.id;
  
 
  const sendStart = async (idx) => {
    await HostStore.UpdatePage(1);
  }


  // Render
    return (
     
        <Container className="mt-4">
          <Row  className="justify-content-center text-center mb-4">
              Room ID : {router.query.id}
         </Row >
          <Row  className="justify-content-center text-center mb-4">
              People Join
         </Row>
         <Row  className="justify-content-center text-center mb-4">
              {joinCount}
         </Row>
         <Row  className="justify-content-center mb-4">
            <button type="button" className="btn btn-primary" onClick ={sendStart}>
                  Start
            </button>
         </Row>     
        </Container>
      

    );
  });
  

  
  export default HostWait;
  