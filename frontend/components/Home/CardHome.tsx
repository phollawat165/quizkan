import React from 'react';
import { Card, CardColumns, Col, ProgressBar, Row } from 'react-bootstrap';
import styles from './Home.module.scss';
import Image from 'next/image';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar ,faCircle, faSquare,faHeart} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { JoinModal } from '../joinGame/modal';

const cardTag = ["join","host","create","acheivement"];
const colors = ["one","two","three","four"]
const icons = [faStar ,faCircle, faSquare,faHeart];


export const CardHome: React.FC<any> = (
  props
) => {
  const router = useRouter();
  const [modalShow, setModalShow] = useState(false);
  return (
    <a
        >
            <Card className={`mb-4 ${styles[colors[props.value]]} rounded`}
                onClick={() => {
                    if (props.tag != "Join Game") {router.push(`/${props.link}`);}
                    else {setModalShow(true);}
                }}
            >
                <Row noGutters className="h-100">
                    
                    <Col className="d-flex align-items-center">
                        <FontAwesomeIcon icon={icons[props.value]} size="6x" className="mx-auto" color="white" /> {""}
                    </Col>
                    
                    <Col className={`d-flex align-items-center text-center ${styles["text"]}`} >{props.tag}</Col>
                </Row>
            </Card>
            <JoinModal show={modalShow} onHide={() => setModalShow(false)} />
        </a >
  );
};

export default CardHome;