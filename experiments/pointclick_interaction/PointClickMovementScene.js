import PsyanimScene from '../../src/core/scene/PsyanimScene';

import PsyanimConstants from '../../src/core/PsyanimConstants';
import PsyanimVehicle from '../../src/core/components/steering/PsyanimVehicle';

import PsyanimArriveBehavior from '../../src/core/components/steering/PsyanimArriveBehavior';
import PsyanimArriveAgent from '../../src/core/components/steering/agents/PsyanimArriveAgent';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

import PsyanimAnimationBaker from '../../src/core/components/utils/PsyanimAnimationBaker';

import PsyanimClickToMoveBasic from '../../src/core/components/controllers/PsyanimClickToMoveBasic';

import PsyanimExperimentManager from '../../src/core/components/experiments/PsyanimExperimentManager';

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

        let clickToMove = this._sceneControls.addComponent(PsyanimClickToMoveBasic);

        let currentParameterSet = this._experimentManager.currentParameterSet;

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
    }
}