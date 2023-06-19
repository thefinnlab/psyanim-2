import Phaser from 'phaser';

import PsyanimScene from '../../src/core/scene/PsyanimScene';

import PsyanimConstants from '../../src/core/PsyanimConstants';
import PsyanimMouseFollowTarget from '../../src/core/components/controllers/PsyanimMouseFollowTarget';
import PsyanimVehicle from '../../src/core/components/steering/PsyanimVehicle';

import PsyanimArriveBehavior from '../../src/core/components/steering/PsyanimArriveBehavior';
import PsyanimArriveAgent from '../../src/core/components/steering/agents/PsyanimArriveAgent';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

// firebase imports
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

export default class MainScene extends PsyanimScene {

    constructor() {

        super('Main Scene');

        // add a document to firestore db
        this._db = firebase.firestore();
    }

    create() {

        super.create();

        // setup scene controls
        this.addEntity('sceneControls')
            .addComponent(PsyanimSceneTitle).entity
            .addComponent(PsyanimPhysicsSettingsController).entity
            .addComponent(PsyanimSceneChangeController);

        // setup mouse follow target
        let mouseTarget = this.addEntity('mouseFollowTarget', 400, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 4,
            color: 0x00ff00
        });

        mouseTarget.addComponent(PsyanimMouseFollowTarget, { radius: 4 });

        // add agents with vehicle components to this scene
        let agent = this.addEntity('agent1', 600, 450, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
            base: 16, altitude: 32, 
            color: 0xffc0cb            
        });

        let vehicle = agent.addComponent(PsyanimVehicle);

        let arriveBehavior = agent.addComponent(PsyanimArriveBehavior);

        arriveBehavior.maxSpeed = 8;

        let arriveAgent = agent.addComponent(PsyanimArriveAgent);
        arriveAgent.arriveBehavior = arriveBehavior;
        arriveAgent.target = mouseTarget;
        arriveAgent.vehicle = vehicle;

        this._keys = {
            I: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I)
        };
    }

    update(t, dt) {

        super.update(t, dt);

        if (Phaser.Input.Keyboard.JustDown(this._keys.I))
        {
            this._db.collection("animation-clips").add({
                projectName: "test",
                experimentName: "interaction",
                runName: "run_1",
                data: [0.1, 1.2, 3.4, 5.6, 7.8, 8.9],
                time: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch((error) => console.error("Error adding document: ", error));    
        }
    }
}