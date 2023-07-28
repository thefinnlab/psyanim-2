import Phaser from 'phaser';

import PsyanimScene from '../../src/core/scene/PsyanimScene';

import PsyanimConstants from '../../src/core/PsyanimConstants';
import PsyanimMouseFollowTarget from '../../src/core/components/controllers/PsyanimMouseFollowTarget';
import PsyanimVehicle from '../../src/core/components/steering/PsyanimVehicle';

import PsyanimAdvancedFleeBehavior from '../../src/core/components/steering/PsyanimAdvancedFleeBehavior';
import PsyanimAdvancedFleeAgent from '../../src/core/components/steering/agents/PsyanimAdvancedFleeAgent';

import PsyanimLineRenderer from '../../src/core/components/rendering/PsyanimLineRenderer';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

export default class AdvancedFleeTest extends PsyanimScene {

    constructor() {

        super('Advanced Flee Test');
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
        this.agent1 = this.addEntity('agent1', 600, 450, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
            base: 16, altitude: 32, 
            color: 0xffc0cb            
        });

        this.agent2 = this.addEntity('agent2', 200, 150, {
            shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE, 
            width: 60, height: 30,
            color: 0xffff00            
        });

        this.vehicle1 = this.agent1.addComponent(PsyanimVehicle);
        this.vehicle2 = this.agent2.addComponent(PsyanimVehicle);

        this.vehicle1.target = mouseTarget;
        
        this.vehicle2.target = mouseTarget;
        this.vehicle2.nSamplesForLookSmoothing = 10;

        this.flee1 = this.agent1.addComponent(PsyanimAdvancedFleeBehavior);
        this.flee2 = this.agent2.addComponent(PsyanimAdvancedFleeBehavior);

        this.flee1.maxSpeed = 6;
        this.flee1.panicDistance = 100;

        this.flee2.maxSpeed = 5;
        this.flee2.panicDistance = 100;
        this.flee2.setAdvancedFleeSearchDirection(false);

        this.fleeAgent1 = this.agent1.addComponent(PsyanimAdvancedFleeAgent);
        this.fleeAgent2 = this.agent2.addComponent(PsyanimAdvancedFleeAgent);

        this.fleeAgent1.vehicle = this.vehicle1;
        this.fleeAgent1.target = mouseTarget;
        this.fleeAgent1.advancedFleeBehavior = this.flee1;

        this.fleeAgent2.vehicle = this.vehicle2;
        this.fleeAgent2.target = mouseTarget;
        this.fleeAgent2.advancedFleeBehavior = this.flee2;

        this.lineRenderer1 = this.agent1.addComponent(PsyanimLineRenderer);
        this.lineRenderer2 = this.agent2.addComponent(PsyanimLineRenderer);

        this.screenBoundary.wrap = false;
    }

    update(t, dt) {
        
        super.update(t, dt);

        this.lineRenderer1.originPoint = this.agent1.position;
        this.lineRenderer1.endPoint = this.flee1._advancedFleeDirection.clone()
            .add(this.agent1.position);

        this.lineRenderer2.originPoint = this.agent2.position;
        this.lineRenderer2.endPoint = this.flee1._advancedFleeDirection.clone()
            .add(this.agent2.position);
    }
}