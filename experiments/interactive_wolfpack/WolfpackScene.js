import PsyanimScene from '../../src/core/scene/PsyanimScene';

import PsyanimVehicle from '../../src/core/components/steering/PsyanimVehicle';
import PsyanimWanderBehavior from '../../src/core/components/steering/PsyanimWanderBehavior';
import PsyanimWanderAgent from '../../src/core/components/steering/agents/PsyanimWanderAgent';
import PsyanimSeekBehavior from '../../src/core/components/steering/PsyanimSeekBehavior';

import PsyanimConstants from '../../src/core/PsyanimConstants';

import PsyanimPlayerController from "../../src/core/components/controllers/PsyanimPlayerController";

import PsyanimFOVSensor from '../../src/core/components/physics/PsyanimFOVSensor';

import PsyanimFleeBehavior from '../../src/core/components/steering/PsyanimFleeBehavior';
import PsyanimBasicPreyBehavior from '../../src/core/components/steering/PsyanimBasicPreyBehavior';
import PsyanimPreyAgent from '../../src/core/components/steering/agents/PsyanimPreyAgent';

import PsyanimArriveBehavior from '../../src/core/components/steering/PsyanimArriveBehavior';
import PsyanimBasicPredatorBehavior from '../../src/core/components/steering/PsyanimBasicPredatorBehavior';
import PsyanimPredatorAgent from '../../src/core/components/steering/agents/PsyanimPredatorAgent';

export default class WolfpackScene extends PsyanimScene {

    static KEY = 'Wolfpack Scene';

    constructor() {

        super(WolfpackScene.KEY);
    }

    create() {

        super.create();

        let currentParameterSet = this.game.registry.get('psyanim_currentParameterSet');

        // setup wander agents
        let nAgents = currentParameterSet.nAgents;

        console.log("settup up " + nAgents + " wandering agents...");

        for (let i = 0; i < nAgents; ++i)
        {
            let deltaX = (Math.random() * 2 - 1) * 350;
            let deltaY = (Math.random() * 2 - 1) * 250;

            let agent = this.addEntity('agent' + i, 400 + deltaX, 300 + deltaY, {
                textureKey: 'wander_agent_tex',
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
                radius: currentParameterSet.agentRadius, color: 0xffc0cb
            });
    
            let wanderVehicle = agent.addComponent(PsyanimVehicle);

            let seek = agent.addComponent(PsyanimSeekBehavior);
            seek.maxSpeed = currentParameterSet.maxAgentSpeed;

            let wander = agent.addComponent(PsyanimWanderBehavior);   
            wander.vehicle = wanderVehicle;
            
            wander.radius = 50;
            wander.maxAngleChangePerFrame = 20;

            wander.seekBehavior = seek;

            let wanderAgent = agent.addComponent(PsyanimWanderAgent);
            wanderAgent.vehicle = wanderVehicle;
            wanderAgent.wanderBehavior = wander;
        }

        // create player
        this._player = this.addEntity('player', 400, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: currentParameterSet.agentRadius,
            color: 0x0000ff
        });

        let playerController = this._player.addComponent(PsyanimPlayerController);
        playerController.speed = 4;

        // based on config, setup either a predator OR a prey agent
        this._agent = this.addEntity('predator', 100, 100, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: currentParameterSet.agentRadius, color: 0xff0000
        });

        let agentVehicle = this._agent.addComponent(PsyanimVehicle);

        let agentSeek = this._agent.addComponent(PsyanimSeekBehavior);
        agentSeek.maxSpeed = currentParameterSet.maxAgentSpeed;

        let agentWander = this._agent.addComponent(PsyanimWanderBehavior);
        agentWander.seekBehavior = agentSeek;
        agentWander.radius = 50;
        agentWander.offset = 250;
        agentWander.maxWanderAngleChangePerFrame = 20;

        let fovSensor = this._agent.addComponent(PsyanimFOVSensor);

        if (currentParameterSet.playerIsPredator)
        {
            // setup agent to be a prey
            let agentFlee = this._agent.addComponent(PsyanimFleeBehavior);
            agentFlee.maxSpeed = 6;
            agentFlee.maxAcceleration = 0.2;
            agentFlee.panicDistance = 250;

            let prey = this._agent.addComponent(PsyanimBasicPreyBehavior);
            prey.fleeBehavior = agentFlee;
            prey.wanderBehavior = agentWander;
            prey.fovSensor = fovSensor;
            prey.subtlety = 30;
            prey.subtletyLag = 500;
    
            let preyAgent = this._agent.addComponent(PsyanimPreyAgent);
            preyAgent.vehicle = agentVehicle;
            preyAgent.preyBehavior = prey;
            preyAgent.target = this._player;
        }
        else // setup agent to be a predator
        {
            let agentArrive = this._agent.addComponent(PsyanimArriveBehavior);
            agentArrive.maxSpeed = 3;
            agentArrive.maxAcceleration = 0.2;
            agentArrive.innerDecelerationRadius = 16;
            agentArrive.outerDecelerationRadius = 40;    

            let predator = this._agent.addComponent(PsyanimBasicPredatorBehavior);
            predator.arriveBehavior = agentArrive;
            predator.wanderBehavior = agentWander;
            predator.fovSensor = fovSensor;
            predator.subtlety = 30;
            predator.subtletyLag = 500;
    
            let predatorAgent = this._agent.addComponent(PsyanimPredatorAgent);
            predatorAgent.vehicle = agentVehicle;
            predatorAgent.predatorBehavior = predator;
            predatorAgent.target = this._player;
        }
    }
}