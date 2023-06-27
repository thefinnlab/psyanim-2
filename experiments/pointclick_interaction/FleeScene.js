import Phaser from 'phaser';

import PsyanimScene from '../../src/core/scene/PsyanimScene';

import PsyanimConstants from '../../src/core/PsyanimConstants';
import PsyanimMouseFollowTarget from '../../src/core/components/controllers/PsyanimMouseFollowTarget';
import PsyanimVehicle from '../../src/core/components/steering/PsyanimVehicle';

import PsyanimFleeBehavior from '../../src/core/components/steering/PsyanimFleeBehavior';
import PsyanimFleeAgent from '../../src/core/components/steering/agents/PsyanimFleeAgent';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';

import PsyanimExperimentManager from '../../src/core/components/experiments/PsyanimExperimentManager';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

export default class FleeScene extends PsyanimScene {

    static KEY = 'Flee Scene';

    constructor() {

        super(FleeScene.KEY);
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

        // setup mouse follow target
        let mouseTarget = this.addEntity('mouseFollowTarget', 400, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 4,
            color: 0x00ff00
        });

        mouseTarget.addComponent(PsyanimMouseFollowTarget, { radius: 4 });

        // add agents to this scene
        let agent1 = this.addEntity('agent1', 600, 450, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
            base: 16, altitude: 32, 
            color: 0xffc0cb            
        });

        let agent2 = this.addEntity('agent2', 200, 150, {
            shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE, 
            width: 60, height: 30,
            color: 0xffff00            
        });

        // add vehicle components to our agents
        let vehicle1 = agent1.addComponent(PsyanimVehicle);
        let vehicle2 = agent2.addComponent(PsyanimVehicle);

        vehicle2.nSamplesForLookSmoothing = 10;

        // add flee behavior components to our agents
        let flee1 = agent1.addComponent(PsyanimFleeBehavior);
        let flee2 = agent2.addComponent(PsyanimFleeBehavior);

        flee1.maxSpeed = 6;
        flee1.maxSpeed = 5;

        // add flee agent component to our agents
        let fleeAgent1 = agent1.addComponent(PsyanimFleeAgent);
        let fleeAgent2 = agent2.addComponent(PsyanimFleeAgent);

        fleeAgent1.fleeBehavior = flee1;
        fleeAgent2.fleeBehavior = flee2;

        fleeAgent1.vehicle = vehicle1;
        fleeAgent2.vehicle = vehicle2;

        fleeAgent1.target = mouseTarget;
        fleeAgent2.target = mouseTarget;
    }
}