import Phaser from 'phaser';

import PsyanimScene from '../../src/core/scene/PsyanimScene';

import PsyanimConstants from '../../src/core/PsyanimConstants';
import PsyanimMouseFollowTarget from '../../src/core/components/controllers/PsyanimMouseFollowTarget';
import PsyanimVehicle from '../../src/core/components/steering/PsyanimVehicle';

import PsyanimArriveBehavior from '../../src/core/components/steering/PsyanimArriveBehavior';
import PsyanimArriveAgent from '../../src/core/components/steering/agents/PsyanimArriveAgent';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

import PsyanimAnimationBaker from '../../src/core/components/utils/PsyanimAnimationBaker';

import PsyanimExperimentTimer from '../../src/core/components/utils/PsyanimExperimentTimer';

import PsyanimClickToMoveBasic from '../../src/core/components/controllers/PsyanimClickToMoveBasic';

import PsyanimExperimentManager from '../../src/core/components/experiments/PsyanimExperimentManager';

import PsyanimFirebaseClient from '../../src/core/components/networking/PsyanimFirebaseClient';

export default class PointClickMovementScene extends PsyanimScene {
    
    static KEY = 'Point-Click Movement Scene';

    constructor() {

        super(PointClickMovementScene.KEY);
    }

    create() {

        super.create();

        // setup scene controls
        this._sceneControls = this.addEntity('sceneControls')
            .addComponent(PsyanimSceneTitle).entity
            .addComponent(PsyanimPhysicsSettingsController).entity;

        this._experimentManager = this._sceneControls.addComponent(PsyanimExperimentManager);

        let currentParameterSet = this._experimentManager.currentParameterSet;

        console.log(currentParameterSet);

        this._firebaseClient = this._sceneControls.addComponent(PsyanimFirebaseClient);

        let clickToMove = this._sceneControls.addComponent(PsyanimClickToMoveBasic);

        this._timer = this._sceneControls.addComponent(PsyanimExperimentTimer);

        let r0 = currentParameterSet.initialPos;

        // add agents with vehicle components to this scene
        let agent = this.addEntity('agent1', r0.x, r0.y, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
            base: 16, altitude: 32, 
            color: 0xffc0cb            
        });

        let vehicle = agent.addComponent(PsyanimVehicle);

        let arriveBehavior = agent.addComponent(PsyanimArriveBehavior);

        arriveBehavior.maxSpeed = 8;

        let arriveAgent = agent.addComponent(PsyanimArriveAgent);
        arriveAgent.arriveBehavior = arriveBehavior;
        arriveAgent.vehicle = vehicle;

        clickToMove.arriveAgent = arriveAgent;

        this._agentAnimationBaker = agent.addComponent(PsyanimAnimationBaker);

        this._keys = {
            I: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I),
        };
    }

    update(t, dt) {

        super.update(t, dt);

        // if (Phaser.Input.Keyboard.JustDown(this._keys.I))
        if (false)
        {
            console.log("beginning animation recording...");

            if  (this._agentAnimationBaker.isRunning)
            {
                this._agentAnimationBaker.stop();
            }

            this._agentAnimationBaker.clear();

            this._agentAnimationBaker.start();

            this._timer.setOnTimerElapsed(() => {

                this._agentAnimationBaker.stop();

                let data = this._agentAnimationBaker.clip.toArray();

                this._firebaseClient.addAnimationClip(
                    'test',
                    'interaction',
                    'run_' + Date.now(),
                    data,
                );

                let jsonData = JSON.stringify(data);

                console.log("finished baking data size: " + jsonData.length);
            });

            this._timer.start(2000);
        }
    }
}