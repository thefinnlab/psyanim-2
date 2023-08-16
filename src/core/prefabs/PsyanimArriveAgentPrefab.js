import PsyanimEntityPrefab from '../PsyanimEntityPrefab';

import PsyanimVehicle from '../components/steering/PsyanimVehicle';

import PsyanimArriveBehavior from '../components/steering/PsyanimArriveBehavior';
import PsyanimArriveAgent from '../components/steering/agents/PsyanimArriveAgent';

export default class PsyanimArriveAgentPrefab extends PsyanimEntityPrefab {

    target;

    maxSpeed;

    constructor(shapeParams) {

        super(shapeParams);

        this.maxSpeed = 8;
    }

    create(entity) {

        super.create(entity);

        let vehicle = entity.addComponent(PsyanimVehicle);

        let arriveBehavior = entity.addComponent(PsyanimArriveBehavior);

        arriveBehavior.maxSpeed = this.maxSpeed;

        let arriveAgent = entity.addComponent(PsyanimArriveAgent);
        arriveAgent.arriveBehavior = arriveBehavior;
        arriveAgent.vehicle = vehicle;
        arriveAgent.target = this.target;

        return entity;
    }
}