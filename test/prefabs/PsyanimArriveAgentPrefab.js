import PsyanimVehicle from '../../src/core/components/steering/PsyanimVehicle';

import PsyanimArriveBehavior from '../../src/core/components/steering/PsyanimArriveBehavior';
import PsyanimArriveAgent from '../../src/core/components/steering/agents/PsyanimArriveAgent';

import PsyanimConstants from '../../src/core/PsyanimConstants';

export default class PsyanimArriveAgentPrefab {

    target;

    constructor() {}

    instantiate(scene, instanceName) {

        // add agents with vehicle components to this scene
        let agent = scene.addEntity(instanceName, 600, 450, {
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
        arriveAgent.target = this.target;

        return agent;
    }
}