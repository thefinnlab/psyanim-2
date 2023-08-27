import Phaser from 'phaser';

import PsyanimScene from '../../src/core/PsyanimScene';

import PsyanimConstants from '../../src/core/PsyanimConstants';
import PsyanimMouseFollowTarget from '../../src/core/components/controllers/PsyanimMouseFollowTarget';
import PsyanimVehicle from '../../src/core/components/steering/PsyanimVehicle';

import PsyanimAdvancedFleeBehavior from '../../src/core/components/steering/PsyanimAdvancedFleeBehavior';
import PsyanimAdvancedFleeAgent from '../../src/core/components/steering/agents/PsyanimAdvancedFleeAgent';

import PsyanimLineRenderer from '../../src/core/components/rendering/PsyanimLineRenderer';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';
import PsyanimAdvancedFleeAgentPrefab from '../../src/core/prefabs/PsyanimAdvancedFleeAgentPrefab';

export default class AdvancedFleeTest extends PsyanimScene {

    static KEY = 'Advanced Flee Test';

    constructor() {

        super(AdvancedFleeTest.KEY);
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
        let advancedFleeAgentPrefab = new PsyanimAdvancedFleeAgentPrefab({
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
            base: 16, altitude: 32, 
            color: 0xffc0cb            
        });

        advancedFleeAgentPrefab.target = mouseTarget;
        advancedFleeAgentPrefab.debug = true;

        this.agent1 = this.instantiatePrefab(advancedFleeAgentPrefab, 'agent1', 600, 450);

        advancedFleeAgentPrefab.maxSpeed = 5;
        advancedFleeAgentPrefab.searchClockwiseDirection = false;

        advancedFleeAgentPrefab.shapeParams = {
            shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE, 
            width: 60, height: 30,
            color: 0xffff00            
        };

        this.agent2 = this.instantiatePrefab(advancedFleeAgentPrefab, 'agent2', 200, 150);

        this.screenBoundary.wrap = false;
    }
}