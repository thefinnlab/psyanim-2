import PsyanimEntityPrefab from "../PsyanimEntityPrefab";

import PsyanimVehicle from "../components/steering/PsyanimVehicle";
import PsyanimAdvancedArriveBehavior from "../components/steering/PsyanimAdvancedArriveBehavior";
import PsyanimAdvancedArriveAgent from "../components/steering/agents/PsyanimAdvancedArriveAgent";

export default class PsyanimAdvancedArriveAgentPrefab extends PsyanimEntityPrefab {

    chargeDuration;
    innerDecelerationRadius;
    outerDecelerationRadius;
    maxAcceleration;

    constructor(shapeParams) {

        super(shapeParams);

        this.chargeDuration = 0.9;
        this.innerDecelerationRadius = 10;
        this.outerDecelerationRadius = 30;
        this.maxAcceleration = 0.4;
    }

    create(entity) {

        super.create(entity);

        let vehicle1 = entity.addComponent(PsyanimVehicle);

        let advancedArrive = entity.addComponent(PsyanimAdvancedArriveBehavior);

        advancedArrive.chargeDuration = this.chargeDuration;
        advancedArrive.innerDecelerationRadius = this.innerDecelerationRadius;
        advancedArrive.outerDecelerationRadius = this.outerDecelerationRadius;
        advancedArrive.maxAcceleration = this.maxAcceleration;

        this.advancedArriveAgent = entity.addComponent(PsyanimAdvancedArriveAgent);

        this.advancedArriveAgent.vehicle = vehicle1;
        this.advancedArriveAgent.advancedArriveBehavior = advancedArrive;

        return entity;
    }
}