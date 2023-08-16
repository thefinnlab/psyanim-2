import PsyanimEntityPrefab from "../PsyanimEntityPrefab";

import PsyanimVehicle from "../components/steering/PsyanimVehicle";
import PsyanimArriveBehavior from "../components/steering/PsyanimArriveBehavior";
import PsyanimSeekBehavior from "../components/steering/PsyanimSeekBehavior";
import PsyanimWanderBehavior from "../components/steering/PsyanimWanderBehavior";
import PsyanimFOVSensor from "../components/physics/PsyanimFOVSensor";
import PsyanimBasicPredatorBehavior from "../components/steering/PsyanimBasicPredatorBehavior";
import PsyanimPredatorAgent from "../components/steering/agents/PsyanimPredatorAgent";

export default class PsyanimPredatorPrefab extends PsyanimEntityPrefab {


    // predator params
    target;
    subtlety;
    subtletyLag;

    // chase params
    maxChaseSpeed;
    maxChaseAcceleration;
    chaseInnerDecelerationRadius;
    chaseOuterDecelerationRadius;

    // wander params
    wanderRadius;
    wanderOffset;
    maxWanderAngleChangePerFrame;
    maxWanderSpeed;
    maxWanderAcceleration;

    constructor(shapeParams) {

        super(shapeParams);

        this.subtlety = 30;
        this.subtletyLag = 500;

        this.maxChaseSpeed = 6;
        this.maxChaseAcceleration = 0.2;
        this.chaseInnerDecelerationRadius = 16;
        this.chaseOuterDecelerationRadius = 40;

        this.wanderRadius = 50;
        this.wanderOffset = 250;
        this.maxWanderAngleChangePerFrame = 20;
        this.maxWanderSpeed = 4;
        this.maxWanderAcceleration = 0.2;
    }

    create(entity) {

        super.create(entity);

        let vehicle = entity.addComponent(PsyanimVehicle);

        let arrive = entity.addComponent(PsyanimArriveBehavior);
        arrive.maxSpeed = this.maxChaseSpeed;
        arrive.maxAcceleration = this.maxChaseAcceleration;
        arrive.innerDecelerationRadius = this.chaseInnerDecelerationRadius;
        arrive.outerDecelerationRadius = this.chaseOuterDecelerationRadius;

        let seek = entity.addComponent(PsyanimSeekBehavior);
        seek.maxSpeed = this.maxWanderSpeed;
        seek.maxAcceleration = this.maxWanderAcceleration;

        let wander = entity.addComponent(PsyanimWanderBehavior);
        wander.seekBehavior = seek;
        wander.radius = this.wanderRadius;
        wander.offset = this.wanderOffset;
        wander.maxWanderAngleChangePerFrame = this.maxWanderAngleChangePerFrame;

        let fovSensor = entity.addComponent(PsyanimFOVSensor);

        let predator = entity.addComponent(PsyanimBasicPredatorBehavior);
        predator.arriveBehavior = arrive;
        predator.wanderBehavior = wander;
        predator.fovSensor = fovSensor;
        predator.subtlety = this.subtlety;
        predator.subtletyLag = this.subtletyLag;

        let predatorAgent = entity.addComponent(PsyanimPredatorAgent);
        predatorAgent.vehicle = vehicle;
        predatorAgent.predatorBehavior = predator;
        predatorAgent.target = this.target;

        return entity;
    }
}