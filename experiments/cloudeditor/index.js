import Phaser from 'phaser';

import Config from './config';

// firebase imports
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

import firebaseConfig from '../../firebase.config.json';

// create phaser game
const game = new Phaser.Game(Config.get());

// initialize firebase
game.registry.set("firebaseConfig", firebaseConfig);

firebase.initializeApp(firebaseConfig);