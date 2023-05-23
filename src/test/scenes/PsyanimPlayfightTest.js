import Phaser from 'phaser';

import PsyanimScene from "../../core/scene/PsyanimScene";

import PsyanimConstants from '../../core/PsyanimConstants';

import PsyanimVehicle from '../../core/components/steering/PsyanimVehicle';
import PsyanimWanderBehavior from '../../core/components/steering/PsyanimWanderBehavior';
import PsyanimWanderDebug from '../../core/components/rendering/PsyanimWanderDebug';
import PsyanimPlayfightBehavior from '../../core/components/steering/PsyanimPlayfightBehavior';
import PsyanimPlayfightAgent from '../../core/components/steering/agents/PsyanimPlayfightAgent';

import PsyanimSeekBehavior from '../../core/components/steering/PsyanimSeekBehavior';
import PsyanimArriveBehavior from '../../core/components/steering/PsyanimArriveBehavior';
import PsyanimFleeBehavior from '../../core/components/steering/PsyanimFleeBehavior';

import PsyanimCollisionAvoidanceBehavior from '../../core/components/steering/PsyanimCollisionAvoidanceBehavior';

import PsyanimPhysicsSettingsController from '../../core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../core/components/controllers/PsyanimSceneController';

import PsyanimSceneTitle from '../../core/components/ui/PsyanimSceneTitle';

export default class PsyanimPlayfightTest extends PsyanimScene {

    constructor() {

        super('Playfight Test');
    }

    create() {

        super.create();

        /**
         *  Global Test Parameters
         */

        let breakDuration = 2000;

        let maxChargeSpeed = 9;
        let maxChargeAcceleration = 0.4;

        let circleAgentRadius = 12;
        let outerDecelerationRadius = 30;
        let panicDistance = 30;

        let maxWanderSpeed = 4;
        let maxWanderAcceleration = 0.2;

        let wanderRadius = 50;
        let wanderOffset = 250;
        let maxWanderAngleChangePerFrame = 20;

        let maxFleeSpeed = 4;
        let maxFleeAcceleration = 0.4;

        let collisionAvoidanceSensorRadius = 100;
        let collisionAvoidanceCollisionRadius = 40;

        /**
         *  Create playfight agents
         */

        // setup scene controls
        this.addEntity('sceneControls')
            .addComponent(PsyanimSceneTitle).entity
            .addComponent(PsyanimPhysicsSettingsController).entity
            .addComponent(PsyanimSceneChangeController);

        // setup agents
        let agents = [];

        for (let i = 0 ; i < 2; ++i)
        {
            let agent = this.addEntity('agent' + i, 500, 300, {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
                base: 16, altitude: 32, radius: circleAgentRadius, color: (i == 0 ? 0xff0000 : 0x0000ff)
            });
    
            let vehicle = agent.addComponent(PsyanimVehicle);
    
            let arrive = agent.addComponent(PsyanimArriveBehavior);
            arrive.maxSpeed = maxChargeSpeed;
            arrive.maxAcceleration = maxChargeAcceleration;
            arrive.innerDecelerationRadius = circleAgentRadius;
            arrive.outerDecelerationRadius = outerDecelerationRadius;
    
            let flee = agent.addComponent(PsyanimFleeBehavior);
            flee.maxSpeed = maxFleeSpeed;
            flee.maxAcceleration = maxFleeAcceleration;
            flee.panicDistance = panicDistance;
    
            let seek = agent.addComponent(PsyanimSeekBehavior);
            seek.maxSpeed = maxWanderSpeed;
            seek.maxAcceleration = maxWanderAcceleration;
    
            let wander = agent.addComponent(PsyanimWanderBehavior);
            wander.seekBehavior = seek;
            wander.radius = wanderRadius;
            wander.offset = wanderOffset;
            wander.maxWanderAngleChangePerFrame = maxWanderAngleChangePerFrame;
    
            // let wanderDebug = agent.addComponent(PsyanimWanderDebug);
            // wanderDebug.wanderBehavior = wander;
    
            let collisionAvoidance = agent.addComponent(PsyanimCollisionAvoidanceBehavior);
            collisionAvoidance.setSensorRadius(collisionAvoidanceSensorRadius);
            collisionAvoidance.collisionRadius = collisionAvoidanceCollisionRadius;
    
            let playfight = agent.addComponent(PsyanimPlayfightBehavior);
            playfight.breakDuration = breakDuration;
            playfight.fleeBehavior = flee;
            playfight.arriveBehavior = arrive;
            playfight.wanderBehavior = wander;
            playfight.collisionAvoidanceBehavior = collisionAvoidance;
    
            let playfightAgent = agent.addComponent(PsyanimPlayfightAgent);
            playfightAgent.playfightBehavior = playfight;
            playfightAgent.vehicle = vehicle;

            agents.push(agent);
        }

        /**
         *  Setup targets for the playfight agents
         */
        let playfightAgent1 = agents[0].getComponent(PsyanimPlayfightAgent);
        let playfightAgent2 = agents[1].getComponent(PsyanimPlayfightAgent);

        playfightAgent1.setTarget(agents[1]);
        playfightAgent2.setTarget(agents[0]);

        this.screenBoundary.wrap = false;
    }
}