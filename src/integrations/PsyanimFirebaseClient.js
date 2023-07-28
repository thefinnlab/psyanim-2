// firebase imports
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

import { v4 as uuidv4 } from 'uuid';

import PsyanimAnimationClip from './PsyanimAnimationClip.mjs';

/**
 *  Query types
 */

class AnimationClipQuery {

    constructor(db) {

        this._db = db;
        
        this._clipData = [];
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
                    let clip = PsyanimAnimationClip.fromArray(doc.data().data);

                    this._clipData.push({
                        id: doc.id,
                        clip: clip
                    });

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
            this._resolve(this._clipData);
        }
    }
}

export default class PsyanimFirebaseClient {

    constructor(firebaseConfig) {

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

    addAnimationClip(data) {

        let newId = uuidv4();

        this.db
            .collection('animation-clips')
            .doc(newId)
            .set({
                data: data,
                time: this.serverTimestamp
            })
            .then(() => console.log("Animation clip document written!"))
            .catch((error) => console.error('Error adding document: ', error));

        return newId;
    }

    addAgentStateLog(data) {

        let newId = uuidv4();

        this.db
            .collection('state-logs')
            .doc(newId)
            .set({
                data: data,
                time: this.serverTimestamp
            })
            .then(() => console.log('Agent state log written!'))
            .catch((error) => console.error('Error adding document: ', error));

        return newId;
    }

    addExperimentTrialMetadata(data) {
        
        let newId = uuidv4();

        this.db
            .collection('trial-metadata')
            .doc(newId)
            .set({
                data: data,
                time: this.serverTimestamp
            })
            .then(() => console.log("Experiment metadata document written!"))
            .catch((error) => console.error("Error adding document: ", error));

        return newId;
    }

    /**
     *  TODO: switch to returning a promise to make client code simpler
     * 
     * @param {*} callback - receives a clipData array containing clip IDs and data
     */
    getAllAnimationClipAsync(callback) {

        this.db
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

        let query = new AnimationClipQuery(this.db);

        return query.execute(clipIDs);
    }

    // TODO: switch to returning a promise to make calling code simpler
    getAllExperimentMetadataAsync(callback) {

        this.db
            .collection('trial-metadata').get()
            .then((querySnapshot) => {

                let experimentMetadata = [];

                querySnapshot.forEach((doc) => {

                    experimentMetadata.push(doc);
                });

                callback(experimentMetadata);
            });
    }
}