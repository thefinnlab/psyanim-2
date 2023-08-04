import PsyanimConstants from "../../src/core/PsyanimConstants";
import PsyanimVehicle from "../../src/core/components/steering/PsyanimVehicle";
import PsyanimAdvancedArriveBehavior from "../../src/core/components/steering/PsyanimAdvancedArriveBehavior";
import PsyanimAdvancedFleeBehavior from "../../src/core/components/steering/PsyanimAdvancedFleeBehavior";
import PsyanimSeekBehavior from "../../src/core/components/steering/PsyanimSeekBehavior";
import PsyanimWanderBehavior from "../../src/core/components/steering/PsyanimWanderBehavior";
import PsyanimAdvancedPlayfightBehavior from "../../src/core/components/steering/PsyanimAdvancedPlayfightBehavior";
import PsyanimAdvancedPlayfightAgent from "../../src/core/components/steering/agents/PsyanimAdvancedPlayfightAgent";

export default class PsyanimPlayfightAgentPrefab {

    color;
    circleAgentRadius;

    initialPosition;

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

    constructor() {

        this.color = 0x00ff00;
        this.circleAgentRadius = 12;

        this.initialPosition = new Phaser.Math.Vector2.ZERO.clone();

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

    instantiate(scene, instanceName) {

        let agent = scene.addEntity(instanceName, this.initialX, this.initialY, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
            radius: this.circleAgentRadius, color: this.color
        });

        let vehicle = agent.addComponent(PsyanimVehicle);

        let advancedArrive = agent.addComponent(PsyanimAdvancedArriveBehavior);
        advancedArrive.maxAcceleration = this.maxChargeAcceleration;
        advancedArrive.innerDecelerationRadius = this.circleAgentRadius;
        advancedArrive.outerDecelerationRadius = this.outerDecelerationRadius;

        let flee = agent.addComponent(PsyanimAdvancedFleeBehavior);
        flee.maxSpeed = this.maxFleeSpeed;
        flee.maxAcceleration = this.maxFleeAcceleration;
        flee.panicDistance = this.panicDistance;

        let seek = agent.addComponent(PsyanimSeekBehavior);
        seek.maxSpeed = this.maxWanderSpeed;
        seek.maxAcceleration = this.maxWanderAcceleration;

        let wander = agent.addComponent(PsyanimWanderBehavior);
        wander.seekBehavior = seek;
        wander.radius = this.wanderRadius;
        wander.offset = this.wanderOffset;
        wander.maxWanderAngleChangePerFrame = this.maxWanderAngleChangePerFrame;

        let playfight = agent.addComponent(PsyanimAdvancedPlayfightBehavior);
        playfight.collisionFrequency = this.collisionFrequency;
        playfight.breakDuration = this.breakDuration;
        playfight.fleeBehavior = flee;
        playfight.advancedArriveBehavior = advancedArrive;
        playfight.wanderBehavior = wander;
        
        let playfightAgent = agent.addComponent(PsyanimAdvancedPlayfightAgent);
        playfightAgent.playfightBehavior = playfight;
        playfightAgent.vehicle = vehicle;

        return agent;
    }
}