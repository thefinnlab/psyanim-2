import Phaser from 'phaser';
import PsyanimComponent from '../../PsyanimComponent';

// firebase imports
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

import firebaseConfig from '../../../../firebase.config.json';

/**
 *  Singleton firebase client
 */
class _PsyanimFirebaseClient {

    static get Instance() {

        if (_PsyanimFirebaseClient._instance == null)
        {
            _PsyanimFirebaseClient._instance = new _PsyanimFirebaseClient();
        }

        return _PsyanimFirebaseClient._instance;
    }

    static _instance = null;

    constructor() {

        firebase.initializeApp(firebaseConfig);

        this._db = firebase.firestore();
    }

    get db() {

        return this._db;
    }

    get serverTimestamp() {

        return firebase.firestore.FieldValue.serverTimestamp();
    }
}

/**
 *  Component interface to singleton firebase client
 */
export default class PsyanimFirebaseClient extends PsyanimComponent {

    constructor(entity) {

        super(entity);
    }

    addAnimationClip(projectName, experimentName, runName, data) {

        _PsyanimFirebaseClient.Instance.db
            .collection('animation-clips')
            .add({
                projectName: projectName,
                experimentName: experimentName,
                runName: runName,
                data: data,
                time: _PsyanimFirebaseClient.Instance.serverTimestamp
            })
            .then((docRef) => console.log("Document written with ID: " + docRef.id))
            .catch((error) => console.error('Error adding document: ', error));
    }

    /**
     * 
     * @param {*} callback - receives a querySnapshot
     */
    getAllAnimationClipDocumentsAsync(callback) {

        _PsyanimFirebaseClient.Instance.db
            .collection("animation-clips").get()
            .then(callback);
    }

    update(t, dt) {

        super.update(t, dt);
    }
}