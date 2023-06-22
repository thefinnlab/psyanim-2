import Phaser from 'phaser';

import PsyanimScene from '../../src/core/scene/PsyanimScene';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

// firebase imports
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

import PsyanimConstants from '../../src/core/PsyanimConstants';

import PsyanimAnimationPlayer from '../../src/core/components/utils/PsyanimAnimationPlayer';
import PsyanimAnimationClip from '../../src/utils/PsyanimAnimationClip.mjs';

import PsyanimFirebaseClient from '../../src/core/components/networking/PsyanimFirebaseClient';

export default class PlaybackScene extends PsyanimScene {

    constructor() {

        super('Playback Scene');
    }

    create() {

        super.create();

        // setup scene controls
        this._sceneControls = this.addEntity('sceneControls')
            .addComponent(PsyanimSceneTitle).entity
            .addComponent(PsyanimPhysicsSettingsController).entity
            .addComponent(PsyanimSceneChangeController).entity;

        this._firebaseClient = this._sceneControls.addComponent(PsyanimFirebaseClient);

        // add agent with playback component
        let agent = this.addEntity('agent1', 600, 450, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
            base: 16, altitude: 32, 
            color: 0xffc0cb            
        });

        this._animationPlayer = agent.addComponent(PsyanimAnimationPlayer);

        // query db for available documents
        this._docs = [];

        this._firebaseClient.getAllAnimationClipDocumentsAsync((querySnapshot) => {

            querySnapshot.forEach((doc) => {

                this._docs.push(doc);

                console.log("retrieved doc id = " + doc.id);
            });

            this._setupExperimentControls();
        });
    }

    _setupExperimentControls() {

        // setup experiment controls
        let experimentControlsElement = document.getElementById('experiment-controls');

        // make sure we clear the controls before we load any other scenes
        this._sceneControls.getComponent(PsyanimSceneChangeController)
            .events.on('beforeLoadScene', () => {
                while (experimentControlsElement.firstChild)
                {
                    experimentControlsElement.removeChild(
                        experimentControlsElement.lastChild
                    );
                }        
            });

        // setup our document selector element
        let selectElement = document.createElement('select');
        selectElement.id = 'documentSelector';
        experimentControlsElement.appendChild(selectElement);

        for (let i = 0; i < this._docs.length; ++i)
        {
            let option = document.createElement('option');
            option.value = this._docs[i].id;
            option.text = this._docs[i].id;
            selectElement.appendChild(option);
        }

        console.log("initial selected doc id: " + selectElement.value);

        this._playAnimation(selectElement.value);

        selectElement.addEventListener('change', (event) => {

            console.log("selected doc id: " + event.target.value);

            this._playAnimation(event.target.value);
        });
    }

    _playAnimation(documentID) {

        let doc = this._docs.find((doc) => doc.id == documentID);

        console.log("playing clip for doc ID: " + doc.id);

        let clip = PsyanimAnimationClip.fromArray(doc.data().data);

        this._animationPlayer.play(clip);
    }

    update(t, dt) {

        super.update(t, dt);
    }
}