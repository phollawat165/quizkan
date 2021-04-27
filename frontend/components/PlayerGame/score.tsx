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
    const [roomID, setRoomID] = useState(router.query.id);
    const [start, serStart] = useState(false);
    const [score, setScore] = useState(playerStore.totalScore);
    const [correct, setCorrect] = useState(null);
    const [show, setShow] = useState(false);
    const WebSocketStore = useRootStore().webSocketStore;
    const [bg, setBg] = useState('white');
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
                setBg('white');
            })();
        }
    }, [playerStore.questionState]);

    useEffect(() => {
        (async () => {
            if (playerStore.personalScore.totalScore > playerStore.totalScore) {
                await playerStore.setTotalScore(
                    playerStore.personalScore.totalScore,
                );
                setCorrect('Your anwser is correct');
                setBg('green');
            } else {
                setCorrect('Your anwser is worng');
                setBg('red');
            }
            await playerStore.setTimer(0);
            await playerStore.setChoice(null);
        })();
    }, [playerStore.personalScore]);

    // Render
    return (
        <Container
            className="mt-4"
            style={{
                backgroundColor: bg,
            }}>
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
