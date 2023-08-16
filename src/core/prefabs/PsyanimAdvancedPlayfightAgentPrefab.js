import PsyanimEntityPrefab from "../PsyanimEntityPrefab";

import PsyanimVehicle from "..//components/steering/PsyanimVehicle";
import PsyanimAdvancedArriveBehavior from "../components/steering/PsyanimAdvancedArriveBehavior";
import PsyanimAdvancedFleeBehavior from "../components/steering/PsyanimAdvancedFleeBehavior";
import PsyanimSeekBehavior from "../components/steering/PsyanimSeekBehavior";
import PsyanimWanderBehavior from "../components/steering/PsyanimWanderBehavior";
import PsyanimAdvancedPlayfightBehavior from "../components/steering/PsyanimAdvancedPlayfightBehavior";
import PsyanimAdvancedPlayfightAgent from "../components/steering/agents/PsyanimAdvancedPlayfightAgent";

export default class PsyanimAdvancedPlayfightAgentPrefab extends PsyanimEntityPrefab {

    breakDuration;
    collisionFrequency;

    maxChargeSpeed;

    wanderRadius;
    wanderOffset;
    maxWanderAngleChangePerFrame;
    maxWanderSpeed;
    maxWanderAcceleration;

    maxFleeSpeed;
    maxFleeAcceleration;
    panicDistance;

    maxChargeAcceleration;
    circleAgentRadius;
    outerDecelerationRadius;

    constructor(shapeParams) {

        super(shapeParams);

        this.breakDuration = 2000;
        this.collisionFrequency = 2500;

        this.maxChargeAcceleration = 0.4;

        this.outerDecelerationRadius = 30;

        this.maxWanderSpeed = 4;
        this.maxWanderAcceleration = 0.2;

        this.wanderRadius = 50;
        this.wanderOffset = 250;
        this.maxWanderAngleChangePerFrame = 20;

        this.maxFleeSpeed = 4;
        this.maxFleeAcceleration = 0.2;
        this.panicDistance = 100;
    }

    create(entity) {

        super.create(entity);

        let vehicle = entity.addComponent(PsyanimVehicle);

        let advancedArrive = entity.addComponent(PsyanimAdvancedArriveBehavior);
        advancedArrive.maxAcceleration = this.maxChargeAcceleration;
        advancedArrive.innerDecelerationRadius = entity.shapeParams.radius;
        advancedArrive.outerDecelerationRadius = this.outerDecelerationRadius;

        let flee = entity.addComponent(PsyanimAdvancedFleeBehavior);
        flee.maxSpeed = this.maxFleeSpeed;
        flee.maxAcceleration = this.maxFleeAcceleration;
        flee.panicDistance = this.panicDistance;

        let seek = entity.addComponent(PsyanimSeekBehavior);
        seek.maxSpeed = this.maxWanderSpeed;
        seek.maxAcceleration = this.maxWanderAcceleration;

        let wander = entity.addComponent(PsyanimWanderBehavior);
        wander.seekBehavior = seek;
        wander.radius = this.wanderRadius;
        wander.offset = this.wanderOffset;
        wander.maxWanderAngleChangePerFrame = this.maxWanderAngleChangePerFrame;

        let playfight = entity.addComponent(PsyanimAdvancedPlayfightBehavior);
        playfight.collisionFrequency = this.collisionFrequency;
        playfight.breakDuration = this.breakDuration;
        playfight.fleeBehavior = flee;
        playfight.advancedArriveBehavior = advancedArrive;
        playfight.wanderBehavior = wander;
        
        let playfightAgent = entity.addComponent(PsyanimAdvancedPlayfightAgent);
        playfightAgent.playfightBehavior = playfight;
        playfightAgent.vehicle = vehicle;

        return entity;
    }
}