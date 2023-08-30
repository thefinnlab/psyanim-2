import PsyanimEntityPrefab from '../PsyanimEntityPrefab';

import PsyanimVehicle from '../components/steering/PsyanimVehicle';
import PsyanimFleeBehavior from '../components/steering/PsyanimFleeBehavior';
import PsyanimFleeAgent from '../components/steering/agents/PsyanimFleeAgent';

export default class PsyanimFleeAgentPrefab extends PsyanimEntityPrefab {

    maxSpeed;
    maxAcceleration;

    constructor(shapeParams) {

        super(shapeParams);

        this.maxSpeed = 6;
        this.maxAcceleration = 0.2;
    }

    create(entity) {

        super.create(entity);

        let vehicle = entity.addComponent(PsyanimVehicle);

        let flee = entity.addComponent(PsyanimFleeBehavior);

        flee.maxSpeed = this.maxSpeed;
        flee.maxAcceleration = this.maxAcceleration;

        let fleeAgent = entity.addComponent(PsyanimFleeAgent);

        fleeAgent.fleeBehavior = flee;
        fleeAgent.vehicle = vehicle;

        return entity;
    }
}