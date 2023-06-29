import Phaser from 'phaser';
import PsyanimComponent from '../../PsyanimComponent';

import PsyanimAnimationClip from '../../../utils/PsyanimAnimationClip.mjs';

// firebase imports
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

import firebaseConfig from '../../../../firebase.config.json';

import { v4 as uuidv4 } from 'uuid';

/**
 *  Query types
 */

class AnimationClipQuery {

    constructor(db) {

        this._db = db;
        
        this._clips = [];
    }

    execute(clipIDs) {

        this._clipCount = clipIDs.length;
        this._receivedClipCount = 0;

        let promise = new Promise((resolve, reject) => {

            this._resolve = resolve;
            this._reject = reject;
        });

        for (let i = 0; i < this._clipCount; ++i)
        {
            let docRef = this._db.collection('animation-clips').doc(clipIDs[i]);

            docRef.get().then((doc) => {
                
                if (doc.exists) 
                {
                    this._clips.push(doc.data());

                    this._receivedClipCount++;

                    this._checkIfReceivedAllClips();
                }
                else
                {
                    let errorMsg = "ERROR: document id not found: " + clipIDs[i];

                    this._reject(new Error(errorMsg));
                }
            });
        };

        return promise;
    }

    _checkIfReceivedAllClips() {

        if (this._receivedClipCount == this._clipCount)
        {
            this._resolve(this._clips);
        }
    }
}

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

        if (location.hostname === '127.0.0.1' || location.hostname === 'localhost')
        {
            console.warn("Using local firebase emulator!");
            this._db.useEmulator('127.0.0.1', 8080);
        }
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

    addAnimationClip(data) {

        let newId = uuidv4();

        _PsyanimFirebaseClient.Instance.db
            .collection('animation-clips')
            .doc(newId)
            .set({
                data: data,
                time: _PsyanimFirebaseClient.Instance.serverTimestamp
            })
            .then(() => console.log("Animation clip document written!"))
            .catch((error) => console.error('Error adding document: ', error));

        return newId;
    }

    addExperimentRunMetadata(data) {
        
        let docId = data.experimentName + "_" + data.runNumber + "_" + data.variationNumber;

        _PsyanimFirebaseClient.Instance.db
            .collection('experiment-metadata')
            .doc(docId)
            .set({
                data: data,
                time: _PsyanimFirebaseClient.Instance.serverTimestamp
            })
            .then(() => console.log("Experiment metadata document written!"))
            .catch((error) => console.error("Error adding document: ", error));

        return docId;
    }

    /**
     *  TODO: switch to returning a promise to make client code simpler
     * 
     * @param {*} callback - receives a clipData array containing clip IDs and data
     */
    getAllAnimationClipAsync(callback) {

        _PsyanimFirebaseClient.Instance.db
            .collection("animation-clips").get()
            .then((querySnapshot) => {

                let clipData = [];

                querySnapshot.forEach((doc) => {

                    let clip = PsyanimAnimationClip.fromArray(doc.data().data);

                    clipData.push({
                        id: doc.id,
                        clip: clip
                    });
                });

                callback(clipData);
            });
    }

    getAnimationClipsByIdAsync(clipIDs) {

        let query = new AnimationClipQuery(_PsyanimFirebaseClient.Instance.db);

        return query.execute(clipIDs);
    }

    // TODO: switch to returning a promise to make client code simpler
    getAllExperimentMetadataAsync(callback) {

        _PsyanimFirebaseClient.Instance.db
            .collection('experiment-metadata').get()
            .then((querySnapshot) => {

                let experimentMetadata = [];

                querySnapshot.forEach((doc) => {

                    experimentMetadata.push(doc);
                });

                callback(experimentMetadata);
            });
    }

    update(t, dt) {

        super.update(t, dt);
    }
}