import { Col, Row, Container } from 'react-bootstrap';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useRootStore } from '../../stores/stores';
import { observer } from 'mobx-react-lite';
import { useEffectOnce, useLifecycles } from 'react-use';

export const PlayerScore: React.FC<any> = observer((props) => {
    const router = useRouter();
    const playerStore = useRootStore().playerStore;
    const [joinCount, setJoinCount] = useState(0);
    const [roomID, setRoomID] = useState(router.query.id);
    const [start, serStart] = useState(false);
    const [score, setScore] = useState(playerStore.totalScore);
    const [correct, setCorrect] = useState(null);
    const [show, setShow] = useState(false);
    const WebSocketStore = useRootStore().webSocketStore;

    /*const tempQuiz = () =>{
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
 }*/
    useEffect(() => {
        if (playerStore.questionState) {
            (async () => {
                setCorrect(null);
                await playerStore.UpdatePage(1);
            })();
        }
    }, [playerStore.questionState]);

    useEffect(() => {
        (async () => {
            if (playerStore.answerChoices[playerStore.choice].isCorrect) {
                await playerStore.UpdateScore();
                setCorrect('Your anwser is correct');
            } else {
                setCorrect('Your anwser is worng');
            }
            await playerStore.setTimer(0);
            await playerStore.setChoice(null);
        })();
    }, [playerStore.answerChoices]);

    // Render
    return (
        <Container className="mt-4">
            <Row className="justify-content-center text-center mb-4">
                Your Score is {playerStore.totalScore}
            </Row>
            <Row className="justify-content-center text-center mb-4">
                {correct}
            </Row>
        </Container>
    );
});

export default PlayerScore;
