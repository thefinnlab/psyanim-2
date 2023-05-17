import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';

import PsyanimConstants from '../../core/PsyanimConstants';
import PsyanimMouseFollowTarget from '../../core/components/controllers/PsyanimMouseFollowTarget';
import PsyanimVehicle from '../../core/components/steering/PsyanimVehicle';

import PsyanimFleeBehavior from '../../core/components/steering/PsyanimFleeBehavior';
import PsyanimFleeAgent from '../../core/components/steering/agents/PsyanimFleeAgent';

export default class FleeTest extends PsyanimScene {

    constructor() {

        super('Flee Test');
    }

    create() {

        super.create();

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

        vehicle1.maxSpeed = 4;
        vehicle2.maxSpeed = 3;

        vehicle2.nSamplesForLookSmoothing = 10;

        // add flee behavior components to our agents
        let flee1 = agent1.addComponent(PsyanimFleeBehavior);
        let flee2 = agent2.addComponent(PsyanimFleeBehavior);

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