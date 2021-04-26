import firebase from 'firebase/app';
import 'firebase/messaging';
import firebaseConfig from '../services/firebase/config';

declare let self: ServiceWorkerGlobalScope;

firebase.initializeApp(firebaseConfig);
firebase.messaging();

export {};
