import Phaser from 'phaser';

import PsyanimScene from "../../core/scene/PsyanimScene";

import PsyanimConstants from '../../core/PsyanimConstants';

import PsyanimVehicle from '../../core/components/steering/PsyanimVehicle';
import PsyanimWanderBehavior from '../../core/components/steering/PsyanimWanderBehavior';
import PsyanimAdvancedPlayfightBehavior from '../../core/components/steering/PsyanimAdvancedPlayfightBehavior';
import PsyanimAdvancedPlayfightAgent from '../../core/components/steering/agents/PsyanimAdvancedPlayfightAgent';

import PsyanimSeekBehavior from '../../core/components/steering/PsyanimSeekBehavior';
import PsyanimArriveBehavior from '../../core/components/steering/PsyanimArriveBehavior';
import PsyanimAdvancedFleeBehavior from '../../core/components/steering/PsyanimAdvancedFleeBehavior';

import PsyanimPhysicsSettingsController from '../../core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../core/components/controllers/PsyanimSceneController';

import PsyanimSceneTitle from '../../core/components/ui/PsyanimSceneTitle';

export default class AdvancedPlayfightTest extends PsyanimScene {

    constructor() {

        super('Advanced Playfight Test');
    }

    create() {

        super.create();

        /**
         *  TODO:
         * 
         *      - create a PsyanimTextRenderer component that allows you to write text to the screen
         *          and updates it when it's 'text' property is changed
         * 
         *      - create a component that runs an 'experiment' and when it ends, it shows a UI overlay
         *          (white screen) and throws an event of some sort
         * 
         */

        /**
         *  Global Test Parameters
         */

        let breakDuration = 2000;

        let maxChargeSpeed = 9;
        let maxChargeAcceleration = 0.4;

        let circleAgentRadius = 12;
        let outerDecelerationRadius = 30;

        let maxWanderSpeed = 4;
        let maxWanderAcceleration = 0.2;

        let wanderRadius = 50;
        let wanderOffset = 250;
        let maxWanderAngleChangePerFrame = 20;

        let maxFleeSpeed = 4;
        let maxFleeAcceleration = 0.2;
        let panicDistance = 100;

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
            let agent = this.addEntity('agent' + i, 200 + i * 400, 300, {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
                base: 16, altitude: 32, radius: circleAgentRadius, color: (i == 0 ? 0xff0000 : 0x0000ff)
            });
    
            let vehicle = agent.addComponent(PsyanimVehicle);
    
            let arrive = agent.addComponent(PsyanimArriveBehavior);
            arrive.maxSpeed = maxChargeSpeed;
            arrive.maxAcceleration = maxChargeAcceleration;
            arrive.innerDecelerationRadius = circleAgentRadius;
            arrive.outerDecelerationRadius = outerDecelerationRadius;
    
            let flee = agent.addComponent(PsyanimAdvancedFleeBehavior);
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

            let playfight = agent.addComponent(PsyanimAdvancedPlayfightBehavior);
            playfight.breakDuration = breakDuration;
            playfight.fleeBehavior = flee;
            playfight.chargeBehavior = arrive;
            playfight.wanderBehavior = wander;
            
            let playfightAgent = agent.addComponent(PsyanimAdvancedPlayfightAgent);
            playfightAgent.playfightBehavior = playfight;
            playfightAgent.vehicle = vehicle;

            agents.push(agent);
        }

        /**
         *  Setup targets for the playfight agents
         */
        let playfightAgent1 = agents[0].getComponent(PsyanimAdvancedPlayfightAgent);
        let playfightAgent2 = agents[1].getComponent(PsyanimAdvancedPlayfightAgent);

        playfightAgent1.setTarget(agents[1]);
        playfightAgent2.setTarget(agents[0]);

        this.screenBoundary.wrap = false;
    }
}