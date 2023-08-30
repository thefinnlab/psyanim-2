import PsyanimEntityPrefab from "../PsyanimEntityPrefab";

import PsyanimVehicle from "../components/steering/PsyanimVehicle";
import PsyanimSeekBehavior from "../components/steering/PsyanimSeekBehavior";
import PsyanimSeekAgent from "../components/steering/agents/PsyanimSeekAgent";

export default class PsyanimSeekAgentPrefab extends PsyanimEntityPrefab {

    maxSpeed;
    maxAcceleration;

    constructor(shapeParams) {

        super(shapeParams);

        this.maxSpeed = 5;
        this.maxAcceleration = 0.2;
    }

    create(entity) {

        super.create(entity);

        let vehicle = entity.addComponent(PsyanimVehicle);

        let seek = entity.addComponent(PsyanimSeekBehavior);
        seek.maxSpeed = this.maxSpeed;
        seek.maxAcceleration = this.maxAcceleration;

        let seekAgent = entity.addComponent(PsyanimSeekAgent);

        seekAgent.seekBehavior = seek;
        seekAgent.vehicle = vehicle;

        return entity;
    }
}