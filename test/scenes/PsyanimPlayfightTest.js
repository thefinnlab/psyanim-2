import Phaser from 'phaser';

import PsyanimScene from "../../src/core/scene/PsyanimScene";

import PsyanimConstants from '../../src/core/PsyanimConstants';

import PsyanimVehicle from '../../src/core/components/steering/PsyanimVehicle';
import PsyanimWanderBehavior from '../../src/core/components/steering/PsyanimWanderBehavior';
import PsyanimPlayfightBehavior from '../../src/core/components/steering/PsyanimPlayfightBehavior';
import PsyanimPlayfightAgent from '../../src/core/components/steering/agents/PsyanimPlayfightAgent';

import PsyanimSeekBehavior from '../../src/core/components/steering/PsyanimSeekBehavior';
import PsyanimArriveBehavior from '../../src/core/components/steering/PsyanimArriveBehavior';
import PsyanimAdvancedFleeBehavior from '../../src/core/components/steering/PsyanimAdvancedFleeBehavior';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

import PsyanimComponentStateRecorder from '../../src/core/components/utils/PsyanimComponentStateRecorder';

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
        this._agents = [];

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

            let playfight = agent.addComponent(PsyanimPlayfightBehavior);
            playfight.breakDuration = breakDuration;
            playfight.fleeBehavior = flee;
            playfight.arriveBehavior = arrive;
            playfight.wanderBehavior = wander;
            
            let playfightAgent = agent.addComponent(PsyanimPlayfightAgent);
            playfightAgent.playfightBehavior = playfight;
            playfightAgent.vehicle = vehicle;

            let stateRecorder = agent.addComponent(PsyanimComponentStateRecorder);
            stateRecorder.componentType = PsyanimPlayfightBehavior;
            stateRecorder.componentInstance = playfight;
            stateRecorder.record();

            this._agents.push(agent);
        }

        /**
         *  Setup targets for the playfight agents
         */
        let playfightAgent1 = this._agents[0].getComponent(PsyanimPlayfightAgent);
        let playfightAgent2 = this._agents[1].getComponent(PsyanimPlayfightAgent);

        playfightAgent1.setTarget(this._agents[1]);
        playfightAgent2.setTarget(this._agents[0]);

        this.screenBoundary.wrap = false;

        this._keys = {
            O: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O),
            P: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P)
        };
    }

    update(t, dt) {

        super.update(t, dt);

        if (Phaser.Input.Keyboard.JustDown(this._keys.O)) 
        {
            let stateRecorder = this._agents[0].getComponent(PsyanimComponentStateRecorder);

            console.log(stateRecorder.data);
        }
        else if (Phaser.Input.Keyboard.JustDown(this._keys.P))
        {
            let stateRecorder = this._agents[1].getComponent(PsyanimComponentStateRecorder);

            console.log(stateRecorder.data);
        }
    }
}