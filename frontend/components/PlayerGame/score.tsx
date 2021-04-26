import { Col, Row ,Container} from 'react-bootstrap';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useRootStore } from '../../stores/stores';
import { observer } from 'mobx-react-lite';
import { useEffectOnce, useLifecycles } from 'react-use';

export const  PlayerScore: React.FC<any> = observer((props) => {
  const router = useRouter();
  const playerStore = useRootStore().playerStore;
  const [joinCount, setJoinCount] = useState(0);
  const [roomID,setRoomID] = useState(router.query.id);
  const [start,serStart]=useState(false);
  const [score,setScore]=useState(playerStore.totalScore);
  const [correct,setCorrect]=useState([]);
  const [show,setShow]=useState(false);

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
  const handleClick = async () => {
    if(!show){
      if(tempQuiz().choices[playerStore.choice].isCorrect){
        await playerStore.UpdateScore();
      }
      await playerStore.setTimer(0);
      await playerStore.setChoice(null);
      setShow(true);
    }
    else{
      await playerStore.UpdatePage(1);
      setShow(false);
    }
    
  }

  // Render
    return (

    
        <Container className="mt-4">
          <Row className="justify-content-center text-center mb-4">
              Your Score is {playerStore.totalScore} {playerStore.choice}
         </Row>
         <Row  className="justify-content-center mb-4">
            <button type="button" className="btn btn-primary" onClick ={handleClick}>
                  check
            </button>
         </Row>     
        </Container>
      

    );
  });
  

  
  export default PlayerScore;
  
