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
  const [id, setId] = useState(props.id);
  const [count, setCount] = useState(props.count);
  const [choices, setChoices] = useState(props.choices);

  const handleChoice = (e,i) => {
    const result = e.target.value;
    const choiceArray = choices.slice();
    choiceArray[i].choice =result;
    setChoices(choiceArray);
  };
  
  const handleCorrect = (e,i) => {
    const result = e.target.checked;
    const choiceArray = choices.slice();
    choiceArray[i].isCorrect =result;
    setChoices(choiceArray);
  };

  const handleAddChoice = () => {
    const choiceArray = choices.slice();
    choiceArray.push({id:count+1,choice:null,isCorrect:false});
    setCount(count+1);
    setChoices(choiceArray);
  }

  const handleDeleteChoice = (idx) => {
    const array = choices.slice();
    array.splice(idx, 1);
    setChoices(array);
  }


  const forms =[];
  for (let i = 0; i < choices.length; i += 2){
    forms.push(
        <Row>
        {i < choices.length && (
            <Col  key={choices[i].id} md={6}>
              <Card className="mb-2">
                  
                    <Form.Group>
                    <Form.Control
                        className="form-control"
                        type="text"
                        placeholder="Type here"
                        defaultValue={choices[i].choice}
                        onChange={(e) => {handleChoice(e,i)}}
                    />
                    </Form.Group>
                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Control
                              className="form-control"
                              type="checkbox"
                              defaultChecked={choices[i].isCorrect}
                              onChange={(e) => {handleCorrect(e,i)}}
                          />
                        </Form.Group>
                      </Col>
        
                      <Col>
                          <button type="button" className=" btn btn-warning" onClick={(e) =>{ handleDeleteChoice(i)}}>
                            Delete
                          </button>
                      </Col>
                    </Row>
                    
              </Card>
            </Col>
        )}
        {i+1 < choices.length && (
            <Col  key={choices[i+1].id} md={6}>
              <Card className="mb-2">
                    <Form.Group>
                    <Form.Control
                        className="form-control"
                        type="text"
                        placeholder="Type here"
                        defaultValue={choices[i+1].choice}
                        onChange={(e) => {handleChoice(e,i+1)}}
                    />
                    </Form.Group>
                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Control
                              className="form-control"
                              type="checkbox"
                              defaultChecked={choices[i+1].isCorrect}
                              onChange={(e) => {handleCorrect(e,i+1)}}
                          />
                        </Form.Group>
                      </Col>
        
                      <Col>
                          <button type="button" className=" btn btn-warning" onClick={(e) =>{ handleDeleteChoice(i+1)}}>
                            Delete
                          </button>
                      </Col>
                    </Row>
              </Card>
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
        placeholder="Type Your Question"
        defaultValue={question}
        onChange={(e) => {setQuestion(e.target.value)}}
      />
    </Form.Group>
    <Container>
    {forms}
    </Container>
    <div className="md-12 xs-12">
      <button type="button" className="btn btn-success btn-block"
      onClick={(e) => {handleAddChoice()}}
      >+</button>
    </div>
   
    </Form>

  );
};

export default QuestionFrom;
