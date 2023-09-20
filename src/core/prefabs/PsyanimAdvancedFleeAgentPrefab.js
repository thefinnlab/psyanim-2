import PsyanimEntityPrefab from "../PsyanimEntityPrefab";

import PsyanimVehicle from "../components/steering/PsyanimVehicle";
import PsyanimAdvancedFleeBehavior from "../components/steering/PsyanimAdvancedFleeBehavior";
import PsyanimAdvancedFleeAgent from "../components/steering/agents/PsyanimAdvancedFleeAgent";
import PsyanimLineRenderer from "../components/rendering/PsyanimLineRenderer";

export default class PsyanimAdvancedFleeAgentPrefab extends PsyanimEntityPrefab {

    maxSpeed;
    panicDistance;

    searchClockwiseDirection;

    constructor(shapeParams = { isEmpty: true }, matterOptions = {}) {

        super(shapeParams, matterOptions);

        this.maxSpeed = 6;
        this.panicDistance = 100;
        this.searchClockwiseDirection = true;
    }

    create(entity) {

        super.create(entity);

        let vehicle = entity.addComponent(PsyanimVehicle);

        let flee = entity.addComponent(PsyanimAdvancedFleeBehavior);
        flee.maxSpeed = this.maxSpeed;
        flee.panicDistance = this.panicDistance;
        flee.searchClockwise = this.searchClockwiseDirection;

        let fleeAgent = entity.addComponent(PsyanimAdvancedFleeAgent);
        fleeAgent.vehicle = vehicle;
        fleeAgent.advancedFleeBehavior = flee;
    }
}