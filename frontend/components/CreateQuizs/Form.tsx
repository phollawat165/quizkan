import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar ,faCircle, faSquare,faHeart} from '@fortawesome/free-solid-svg-icons';
import { Col, Container, Jumbotron, Row, Form ,Card} from 'react-bootstrap';
import React, { useState, useEffect, useRef } from 'react';
import quizAns from '../../models/quiz/quizAns';

import style from './CreateQuiz.module.scss';
import dayjs from 'dayjs';

export type QuestionProps = Partial<quizAns>;

export const QuestionFrom: React.FC<QuestionProps> = (
  props
) => {
  
 
  const colors = ["one","two","three","four"]
  const icons = [faStar ,faCircle, faSquare,faHeart];
  const [question, setQuestion] = useState(props.question);
  const [count, setCount] = useState(props.count);
  const [choice, setChoice] = useState(props.choice);
  
  const corrects = [];
  for(let i=0;i<choice.length;i++){
    if(props.correct.includes(i)){
      corrects.push(true);
    }
    else{
      corrects.push(false);
    }
  }



  const [correct, setCorrect] = useState(corrects);

  const handleChoice = (e,i) => {
    const newC = e.target.value;
    let choices = choice.slice();
    let c = choices[i];
    c = newC;
    choices[i]=c;
    setChoice(choices);
  };


  const handleDeleteChoice = idx => {
    const array = choice.slice();
    array.splice(idx, 1);
    
    console.log("delete")
    setChoice(array);
  }

  const forms =[];
  for (let i = 0; i < choice.length; i += 2){
    forms.push(
        <Row key={i}>
        {i < choice.length && (
            <Col md={1}>
               <Form.Group>
                <Form.Control
                    className="form-control"
                    type="checkbox"
                    defaultChecked={correct[i]}

                />
                </Form.Group>
            </Col>
        )}
        {i < choice.length && (
            <Col md={4}>
                <Form.Group>
                <Form.Control
                    className="form-control"
                    type="text"
                    defaultValue={choice[i]}
                    onChange={(e) => handleChoice(e,i)}
                />
                </Form.Group>
            </Col>
        )}
        {i < choice.length && (
            <Col md={1}>
                <button type="button" className=" btn btn-warning" onClick={(e) =>{e.preventDefault(); handleDeleteChoice(i)}}>
                  Delete
                </button>
            </Col>
        )}
        {i+1 < choice.length && (
             <Col md={1}>
             <Form.Group>
              <Form.Control
                  className="form-control"
                  type="checkbox"
                  defaultChecked={correct[i+1]}

              />
              </Form.Group>
          </Col>
        )}
        {i + 1 < choice.length && (
         
         <Col md={4}>
             <Form.Group>
             <Form.Control
                 className="form-control"
                 type="text"
                 defaultValue={choice[i+1]}
                 onChange={(e) => handleChoice(e,i+1)}
             />
             </Form.Group>
         </Col>
        )}
         {i+1 < choice.length && (
            <Col md={1}>
                <button type="button" className="btn btn-warning" onClick={(e) =>{e.preventDefault(); handleDeleteChoice(i+1)}}>
                  Delete
                </button>
            </Col>
        )}
      </Row>
    );
  }
  
  return (

    <Form>
    <Form.Group>
      <Form.Control
        className="form-control"
        type="text"
        placeholder="Question"
        defaultValue={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
    </Form.Group>
    <Container>
    {forms}
    </Container>
    <div className="md-12 xs-12">
      <button type="button" className="btn btn-success btn-block">+</button>
    </div>
   
    </Form>

  );
};

export default QuestionFrom;
