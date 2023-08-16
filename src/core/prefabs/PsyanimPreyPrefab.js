import PsyanimEntityPrefab from "../PsyanimEntityPrefab";

import PsyanimVehicle from "../components/steering/PsyanimVehicle";
import PsyanimFleeBehavior from "../components/steering/PsyanimFleeBehavior";
import PsyanimSeekBehavior from "../components/steering/PsyanimSeekBehavior";
import PsyanimWanderBehavior from "../components/steering/PsyanimWanderBehavior";
import PsyanimFOVSensor from "../components/physics/PsyanimFOVSensor";
import PsyanimBasicPreyBehavior from "../components/steering/PsyanimBasicPreyBehavior";
import PsyanimPreyAgent from '../components/steering/agents/PsyanimPreyAgent';

export default class PsyanimPreyPrefab extends PsyanimEntityPrefab {

    // prey params
    target;
    subtlety;
    subtletyLag;

    // flee params
    maxFleeSpeed;
    maxFleeAcceleration;
    panicDistance;

    // wander params
    maxWanderSpeed;
    maxWanderAcceleration;
    wanderRadius;
    wanderOffset;
    maxWanderAngleChangePerFrame;

    constructor(shapeParams) {

        super(shapeParams);

        this.subtlety = 30;
        this.subtletyLag = 500;

        this.maxFleeSpeed = 6;
        this.maxFleeAcceleration = 0.2;
        this.panicDistance = 250;

        this.maxWanderSpeed = 4;
        this.maxWanderAcceleration = 0.2;
        this.wanderRadius = 50;
        this.wanderOffset = 250;
        this.maxWanderAngleChangePerFrame = 20;
    }

    create(entity) {

        super.create(entity);

        let vehicle = entity.addComponent(PsyanimVehicle);

        let flee = entity.addComponent(PsyanimFleeBehavior);
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

        let fovSensor = entity.addComponent(PsyanimFOVSensor);

        let prey = entity.addComponent(PsyanimBasicPreyBehavior);
        prey.fleeBehavior = flee;
        prey.wanderBehavior = wander;
        prey.fovSensor = fovSensor;
        prey.subtlety = this.subtlety;
        prey.subtletyLag = this.subtletyLag;

        let preyAgent = entity.addComponent(PsyanimPreyAgent);
        preyAgent.vehicle = vehicle;
        preyAgent.preyBehavior = prey;
        preyAgent.target = this.target;

        return entity;
    }
}