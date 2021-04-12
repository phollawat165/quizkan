import React from 'react';
import { Col, Row ,Container} from 'react-bootstrap';
import Head from 'next/head';
import styles from '../styles/Home.module.scss';
import DefaultLayout from '../../layouts/Default';


export const hostGame: React.FC<any> = (props) => {
  
    return (
      <DefaultLayout>
        <Head>
          <title>Host Game</title>
        </Head>
       
      </DefaultLayout>
    );
  };
  

  
  export default hostGame;
  