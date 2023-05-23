import Phaser from 'phaser';

import PsyanimExperiment from '../../src/core/scene/PsyanimExperiment';

import PsyanimConstants from '../../src/core/PsyanimConstants';

import PsyanimVehicle from '../../src/core/components/steering/PsyanimVehicle';

import PsyanimWanderBehavior from '../../src/core/components/steering/PsyanimWanderBehavior';
import PsyanimSeekBehavior from '../../src/core/components/steering/PsyanimSeekBehavior';
import PsyanimArriveBehavior from '../../src/core/components/steering/PsyanimArriveBehavior';
import PsyanimAdvancedFleeBehavior from '../../src/core/components/steering/PsyanimAdvancedFleeBehavior';

import PsyanimPlayfightBehavior from '../../src/core/components/steering/PsyanimPlayfightBehavior';
import PsyanimPlayfightAgent from '../../src/core/components/steering/agents/PsyanimPlayfightAgent';

export default class PlayfightExperiment extends PsyanimExperiment {

    constructor() {

        super('Playfight Experiment');

        /**
         *  Setup parameters for this experiment
         */

        // declare your variables that vary from run to run in arrays
        let experimentDurations = [4000, 6000, 7000, 8000, 10000]; // every experiment run needs a duration set
        let breakDurations = [2000, 2500, 3000, 3500, 4000];

        let maxChargeSpeeds = [8, 9, 10, 11, 12];

        // declare the rest of your parameters that remain constant between runs in a single object
        let parameterSet = {

            maxChargeAcceleration: 0.4,

            circleAgentRadius: 12,
            outerDecelerationRadius: 30,
    
            maxWanderSpeed: 4,
            maxWanderAcceleration: 0.2,
    
            wanderRadius: 50,
            wanderOffset: 250,
            maxWanderAngleChangePerFrame: 20,
    
            maxFleeSpeed: 4,
            maxFleeAcceleration: 0.2,
            panicDistance: 100,
        };

        // add parameter sets to this experiment, updating the value as you add each one
        for (let i = 0; i < experimentDurations.length; ++i)
        {
            parameterSet.experimentDuration = experimentDurations[i];

            parameterSet.breakDuration = breakDurations[i];
            parameterSet.maxChargeSpeed = maxChargeSpeeds[i];

            this.addParameterSet(parameterSet);
        }
    }

    init() {

        super.init();
    }

    create() {

        super.create();

        /**
         *  Get the current parameter set for this experiment run
         */
        let params = this.currentParameterSet;

        /**
         *  Create playfight agents
         */

        let agents = [];

        for (let i = 0 ; i < 2; ++i)
        {
            let agent = this.addEntity('agent' + i, 200 + i * 400, 300, {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
                radius: params.circleAgentRadius, color: (i == 0 ? 0xff0000 : 0x0000ff)
            });
    
            let vehicle = agent.addComponent(PsyanimVehicle);
    
            let arrive = agent.addComponent(PsyanimArriveBehavior);
            arrive.maxSpeed = params.maxChargeSpeed;
            arrive.maxAcceleration = params.maxChargeAcceleration;
            arrive.innerDecelerationRadius = params.circleAgentRadius;
            arrive.outerDecelerationRadius = params.outerDecelerationRadius;
    
            let flee = agent.addComponent(PsyanimAdvancedFleeBehavior);
            flee.maxSpeed = params.maxFleeSpeed;
            flee.maxAcceleration = params.maxFleeAcceleration;
            flee.panicDistance = params.panicDistance;
    
            let seek = agent.addComponent(PsyanimSeekBehavior);
            seek.maxSpeed = params.maxWanderSpeed;
            seek.maxAcceleration = params.maxWanderAcceleration;
    
            let wander = agent.addComponent(PsyanimWanderBehavior);
            wander.seekBehavior = seek;
            wander.radius = params.wanderRadius;
            wander.offset = params.wanderOffset;
            wander.maxWanderAngleChangePerFrame = params.maxWanderAngleChangePerFrame;
    
            let playfight = agent.addComponent(PsyanimPlayfightBehavior);
            playfight.breakDuration = params.breakDuration;
            playfight.fleeBehavior = flee;
            playfight.arriveBehavior = arrive;
            playfight.wanderBehavior = wander;
    
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