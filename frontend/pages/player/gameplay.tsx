import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import {
    Navbar,
    Nav,
    Col,
    Container,
    Jumbotron,
    Row,
    Form,
    Card,
    NavDropdown,
} from 'react-bootstrap';
import DefaultLayout from '../../layouts/Default';
import QuestionFrom from '../../components/HostGame/Form';
import Image from 'react-bootstrap/Image';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../components/Navigation/NavBar.module.scss';
import { useAuth } from 'hooks/auth';
import { firebase as firebaseClient } from 'services/firebase/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faStar,
    faCircle,
    faSquare,
    faHeart,
    faCheck,
} from '@fortawesome/free-solid-svg-icons';
import style from '../../../components/HostGame/Start.module.scss';
import PlayerWait from '../../components/PlayerGame/wait';
import PlayerGame from '../../components/PlayerGame/game';
import PlayerScore from '../../components/PlayerGame/score';
import temp from 'pages/auth/temp';
import { useRootStore } from '../../stores/stores';
import { observer } from 'mobx-react-lite';
import { useEffectOnce, useLifecycles } from 'react-use';

export const HostGameplay = observer((props) => {
    const router = useRouter();
    const PlayerStore = useRootStore().playerStore;
    const { user } = useAuth();
    useEffect(() => {
        console.log('Page changed to page', PlayerStore.page);
    }, [PlayerStore.page]);

    return (
        <DefaultLayout>
            <Head>
                <title>Player Game Play</title>
            </Head>
            {PlayerStore.page == 0 && <PlayerWait />}
            {PlayerStore.page == 1 && <PlayerGame />}
            {PlayerStore.page == 2 && <PlayerScore />}
        </DefaultLayout>
    );
});

export default HostGameplay;
