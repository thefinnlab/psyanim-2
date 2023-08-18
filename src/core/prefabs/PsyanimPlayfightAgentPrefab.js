import PsyanimEntityPrefab from '../PsyanimEntityPrefab';

import PsyanimVehicle from '../components/steering/PsyanimVehicle';
import PsyanimArriveBehavior from '../components/steering/PsyanimArriveBehavior';
import PsyanimAdvancedFleeBehavior from '../components/steering/PsyanimAdvancedFleeBehavior';
import PsyanimSeekBehavior from '../components/steering/PsyanimSeekBehavior';
import PsyanimWanderBehavior from '../components/steering/PsyanimWanderBehavior';
import PsyanimPlayfightBehavior from '../components/steering/PsyanimPlayfightBehavior';
import PsyanimPlayfightAgent from '../components/steering/agents/PsyanimPlayfightAgent';

export default class PsyanimPlayfightAgentPrefab extends PsyanimEntityPrefab {

    breakDuration;

    maxChargeSpeed;
    maxChargeAcceleration;

    innerDecelerationRadius;
    outerDecelerationRadius;

    maxWanderSpeed;
    maxWanderAcceleration;
    wanderRadius;
    wanderOffset;
    maxWanderAngleChangePerFrame;
    
    maxFleeSpeed;
    maxFleeAcceleration;
    panicDistance;

    constructor(shapeParams) {

        super(shapeParams);

        this.breakDuration = 2000;

        this.maxChargeSpeed = 9;
        this.maxChargeAcceleration = 0.4;

        this.innerDecelerationRadius = 12;
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
    
        let arrive = entity.addComponent(PsyanimArriveBehavior);
        arrive.maxSpeed = this.maxChargeSpeed;
        arrive.maxAcceleration = this.maxChargeAcceleration;
        arrive.innerDecelerationRadius = this.circleAgentRadius;
        arrive.outerDecelerationRadius = this.outerDecelerationRadius;

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

        let playfight = entity.addComponent(PsyanimPlayfightBehavior);
        playfight.breakDuration = this.breakDuration;
        playfight.fleeBehavior = flee;
        playfight.arriveBehavior = arrive;
        playfight.wanderBehavior = wander;
        
        let playfightAgent = entity.addComponent(PsyanimPlayfightAgent);
        playfightAgent.playfightBehavior = playfight;
        playfightAgent.vehicle = vehicle;
    }
}
