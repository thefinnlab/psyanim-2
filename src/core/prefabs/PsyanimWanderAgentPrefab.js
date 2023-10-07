import PsyanimEntityPrefab from "../PsyanimEntityPrefab.js";

import PsyanimVehicle from "../components/steering/PsyanimVehicle.js";
import PsyanimSeekBehavior from "../components/steering/PsyanimSeekBehavior.js";
import PsyanimWanderBehavior from "../components/steering/PsyanimWanderBehavior.js";
import PsyanimWanderAgent from "../components/steering/agents/PsyanimWanderAgent.js";

import PsyanimWanderDebug from '../components/rendering/PsyanimWanderDebug.js';

export default class PsyanimWanderAgentPrefab extends PsyanimEntityPrefab {

    radius;
    offset;
    maxAngleChangePerFrame;

    maxSpeed;
    maxAcceleration;
    
    debug;

    constructor(shapeParams = { isEmpty: true }, matterOptions = {}) {

        super(shapeParams, matterOptions);

        this.radius = 50;
        this.offset = 150;
        this.maxAngleChangePerFrame = 20;

        this.maxSpeed = 3;
        this.maxAcceleration = 0.2;

        this.debug = false;
    }

    create(entity) {

        super.create(entity);

        let vehicle = entity.addComponent(PsyanimVehicle);
        let seek = entity.addComponent(PsyanimSeekBehavior);

        seek.maxSpeed = this.maxSpeed;
        seek.maxAcceleration = this.maxAcceleration;

        let wander = entity.addComponent(PsyanimWanderBehavior);

        wander.radius = this.radius;
        wander.offset = this.offset;
        wander.maxAngleChangePerFrame = this.maxAngleChangePerFrame;

        wander.seekBehavior = seek;

        let wanderAgent = entity.addComponent(PsyanimWanderAgent);
        wanderAgent.vehicle = vehicle;
        wanderAgent.wanderBehavior = wander;

        if (this.debug)
        {
            let wanderDebug = entity.addComponent(PsyanimWanderDebug);
            wanderDebug.wanderBehavior = wander;
        }

        return entity;
    }
}