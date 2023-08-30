import PsyanimEntityPrefab from '../PsyanimEntityPrefab';

import PsyanimVehicle from '../components/steering/PsyanimVehicle';
import PsyanimFleeBehavior from '../components/steering/PsyanimFleeBehavior';
import PsyanimEvadeBehavior from '../components/steering/PsyanimEvadeBehavior';
import PsyanimEvadeAgent from '../components/steering/agents/PsyanimEvadeAgent';

export default class PsyanimEvadeAgentPrefab extends PsyanimEntityPrefab {

    maxSpeed;
    maxAcceleration;

    constructor(shapeParams) {

        super(shapeParams);

        this.maxSpeed = 6;
        this.maxAcceleration = 0.2;
    }

    create(entity) {

        super.create(entity);

        let evadeAgentVehicle = entity.addComponent(PsyanimVehicle);

        let fleeBehavior = entity.addComponent(PsyanimFleeBehavior);
        fleeBehavior.maxSpeed = this.maxSpeed;
        fleeBehavior.maxAcceleration = this.maxAcceleration;

        let evadeBehavior = entity.addComponent(PsyanimEvadeBehavior);
        evadeBehavior.fleeBehavior = fleeBehavior;

        let evadeAgent = entity.addComponent(PsyanimEvadeAgent);
        evadeAgent.vehicle = evadeAgentVehicle;
        evadeAgent.evadeBehavior = evadeBehavior;

        return entity;
    }
}