import Phaser from 'phaser';

import PsyanimScene from '../../src/core/scene/PsyanimScene';

import PsyanimConstants from '../../src/core/PsyanimConstants';

import PsyanimVehicle from '../../src/core/components/steering/PsyanimVehicle';
import PsyanimAdvancedFleeBehavior from '../../src/core/components/steering/PsyanimAdvancedFleeBehavior';
import PsyanimArriveBehavior from '../../src/core/components/steering/PsyanimArriveBehavior';
import PsyanimSeekBehavior from '../../src/core/components/steering/PsyanimSeekBehavior';
import PsyanimWanderBehavior from '../../src/core/components/steering/PsyanimWanderBehavior';
import PsyanimPlayfightBehavior from '../../src/core/components/steering/PsyanimPlayfightBehavior';
import PsyanimPlayfightAgent from '../../src/core/components/steering/agents/PsyanimPlayfightAgent';

import PsyanimComponentStateRecorder from '../../src/core/components/utils/PsyanimComponentStateRecorder';

export default class PlayfightScene extends PsyanimScene {

    static KEY = 'PlayfightScene';

    constructor() {

        super(PlayfightScene.KEY);
    }

    init() {
        
        super.init();
    }

    create() {

        super.create();

        /**
         *  Create playfight agents
         */

        this._agents = [];

        let circleAgentRadius = 12;

        for (let i = 0 ; i < 2; ++i)
        {
            let agent = this.addEntity('agent' + i, 200 + i * 400, 300, {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
                radius: circleAgentRadius, color: (i == 0 ? 0xff0000 : 0x0000ff)
            });
    
            let vehicle = agent.addComponent(PsyanimVehicle);
    
            let arrive = agent.addComponent(PsyanimArriveBehavior);
            arrive.maxSpeed = 10;
            arrive.maxAcceleration = 0.4;
            arrive.innerDecelerationRadius = circleAgentRadius;
            arrive.outerDecelerationRadius = 30;
    
            let flee = agent.addComponent(PsyanimAdvancedFleeBehavior);
            flee.maxSpeed = 4;
            flee.maxAcceleration = 0.2;
            flee.panicDistance = 100;
    
            let seek = agent.addComponent(PsyanimSeekBehavior);
            seek.maxSpeed = 4;
            seek.maxAcceleration = 0.2;
    
            let wander = agent.addComponent(PsyanimWanderBehavior);
            wander.seekBehavior = seek;
            wander.radius = 50;
            wander.offset = 250;
            wander.maxWanderAngleChangePerFrame = 20;
    
            let playfight = agent.addComponent(PsyanimPlayfightBehavior);
            playfight.breakDuration = 2500;
            playfight.fleeBehavior = flee;
            playfight.arriveBehavior = arrive;
            playfight.wanderBehavior = wander;
    
            let playfightAgent = agent.addComponent(PsyanimPlayfightAgent);
            playfightAgent.playfightBehavior = playfight;
            playfightAgent.vehicle = vehicle;

            let stateRecorder = agent.addComponent(PsyanimComponentStateRecorder);
            stateRecorder.record(PsyanimPlayfightBehavior, playfight);

            this._agents.push(agent);

            this._keys = {
                O: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O),
                P: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P)
            };
        }

        /**
         *  Setup targets for the playfight agents
         */
        let playfightAgent1 = this._agents[0].getComponent(PsyanimPlayfightAgent);
        let playfightAgent2 = this._agents[1].getComponent(PsyanimPlayfightAgent);

        playfightAgent1.setTarget(this._agents[1]);
        playfightAgent2.setTarget(this._agents[0]);

        this.screenBoundary.wrap = false;        
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