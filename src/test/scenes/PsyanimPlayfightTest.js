import Phaser from 'phaser';

import PsyanimScene from "../../core/scene/PsyanimScene";

import PsyanimConstants from '../../core/PsyanimConstants';

import PsyanimVehicle from '../../core/components/steering/PsyanimVehicle';
import PsyanimWanderBehavior from '../../core/components/steering/PsyanimWanderBehavior';
import PsyanimPlayfightBehavior from '../../core/components/steering/PsyanimPlayfightBehavior';
import PsyanimPlayfightAgent from '../../core/components/steering/agents/PsyanimPlayfightAgent';

import PsyanimSeekBehavior from '../../core/components/steering/PsyanimSeekBehavior';
import PsyanimArriveBehavior from '../../core/components/steering/PsyanimArriveBehavior';
import PsyanimFleeBehavior from '../../core/components/steering/PsyanimFleeBehavior';

import PsyanimCollisionAvoidanceBehavior from '../../core/components/steering/PsyanimCollisionAvoidanceBehavior';

export default class PsyanimPlayfightTest extends PsyanimScene {

    constructor() {

        super('Playfight Test');
    }

    create() {

        super.create();

        let circleAgentRadius = 12;
        let outerDecelerationRadius = 30;
        let panicDistance = 30;

        let breakDuration = 2000;

        let maxChargeSpeed = 9;
        let maxChargeAcceleration = 0.4;

        let maxWanderSpeed = 4;
        let maxWanderAcceleration = 0.2;

        let maxFleeSpeed = 4;
        let maxFleeAcceleration = 0.4;

        let collisionAvoidanceSensorRadius = 100;
        let collisionAvoidanceCollisionRadius = 40;

        // setup wander agent 1
        let agent1 = this.addEntity('agent1', 500, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
            base: 16, altitude: 32, radius: circleAgentRadius, color: 0xff0000         
        });

        let vehicle1 = agent1.addComponent(PsyanimVehicle);

        let arrive1 = agent1.addComponent(PsyanimArriveBehavior);
        arrive1.maxSpeed = maxChargeSpeed;
        arrive1.maxAcceleration = maxChargeAcceleration;
        arrive1.innerDecelerationRadius = circleAgentRadius;
        arrive1.outerDecelerationRadius = outerDecelerationRadius;

        let flee1 = agent1.addComponent(PsyanimFleeBehavior);
        flee1.maxSpeed = maxFleeSpeed;
        flee1.maxAcceleration = maxFleeAcceleration;
        flee1.panicDistance = panicDistance;

        let seek1 = agent1.addComponent(PsyanimSeekBehavior);
        seek1.maxSpeed = maxWanderSpeed;
        seek1.maxAcceleration = maxWanderAcceleration;

        let wander1 = agent1.addComponent(PsyanimWanderBehavior);
        wander1.seekBehavior = seek1;

        let collisionAvoidance1 = agent1.addComponent(PsyanimCollisionAvoidanceBehavior);
        collisionAvoidance1.setSensorRadius(collisionAvoidanceSensorRadius);
        collisionAvoidance1.collisionRadius = collisionAvoidanceCollisionRadius;

        let playfight1 = agent1.addComponent(PsyanimPlayfightBehavior);
        playfight1.breakDuration = breakDuration;
        playfight1.fleeBehavior = flee1;
        playfight1.arriveBehavior = arrive1;
        playfight1.wanderBehavior = wander1;
        playfight1.collisionAvoidanceBehavior = collisionAvoidance1;

        let playfightAgent1 = agent1.addComponent(PsyanimPlayfightAgent);
        playfightAgent1.playfightBehavior = playfight1;
        playfightAgent1.vehicle = vehicle1;

        // setup wander agent 2
        let agent2 = this.addEntity('agent2', 300, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
            base: 16, altitude: 32, radius: circleAgentRadius, color: 0x00ff00         
        });

        let vehicle2 = agent2.addComponent(PsyanimVehicle);

        let arrive2 = agent2.addComponent(PsyanimArriveBehavior);
        arrive2.maxSpeed = maxChargeSpeed;
        arrive2.maxAcceleration = maxChargeAcceleration;
        arrive2.innerDecelerationRadius = circleAgentRadius;
        arrive2.outerDecelerationRadius = outerDecelerationRadius;

        let flee2 = agent2.addComponent(PsyanimFleeBehavior);
        flee2.maxSpeed = maxFleeSpeed;
        flee2.maxAcceleration = maxFleeAcceleration;
        flee2.panicDistance = panicDistance;

        let seek2 = agent2.addComponent(PsyanimSeekBehavior);
        seek2.maxSpeed = maxWanderSpeed;
        seek2.maxAcceleration = maxWanderAcceleration;

        let wander2 = agent2.addComponent(PsyanimWanderBehavior);
        wander2.seekBehavior = seek2;

        let collisionAvoidance2 = agent2.addComponent(PsyanimCollisionAvoidanceBehavior);
        collisionAvoidance2.setSensorRadius(collisionAvoidanceSensorRadius);
        collisionAvoidance2.collisionRadius = collisionAvoidanceCollisionRadius;

        let playfight2 = agent2.addComponent(PsyanimPlayfightBehavior);
        playfight2.breakDuration = breakDuration;
        playfight2.fleeBehavior = flee2;
        playfight2.arriveBehavior = arrive2;
        playfight2.wanderBehavior = wander2;
        playfight2.collisionAvoidanceBehavior = collisionAvoidance2;

        let playfightAgent2 = agent2.addComponent(PsyanimPlayfightAgent);
        playfightAgent2.playfightBehavior = playfight2;
        playfightAgent2.vehicle = vehicle2;

        // setup targets for each playfight component
        playfightAgent1.setTarget(agent2);
        playfightAgent2.setTarget(agent1);

        // TODO: for the screen boundary wrapping to look good, 
        // we need the wander behavior to avoid the screen boundaries...
        this.screenBoundary.wrap = false;
    }
}