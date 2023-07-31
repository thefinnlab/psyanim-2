import PsyanimScene from '../../src/core/PsyanimScene';

import PsyanimConstants from "../../src/core/PsyanimConstants";

import PsyanimSceneTitle from "../../src/core/components/ui/PsyanimSceneTitle";
import PsyanimPhysicsSettingsController from "../../src/core/components/controllers/PsyanimPhysicsSettingsController";
import PsyanimSceneChangeController from "../../src/core/components/controllers/PsyanimSceneController";

import PsyanimPlayerController from "../../src/core/components/controllers/PsyanimPlayerController";

import PsyanimFleeBehavior from '../../src/core/components/steering/PsyanimFleeBehavior';
import PsyanimSeekBehavior from "../../src/core/components/steering/PsyanimSeekBehavior";
import PsyanimWanderBehavior from "../../src/core/components/steering/PsyanimWanderBehavior";

import PsyanimFOVSensor from "../../src/core/components/physics/PsyanimFOVSensor";

import PsyanimVehicle from '../../src/core/components/steering/PsyanimVehicle';

import PsyanimBasicPreyBehavior from '../../src/core/components/steering/PsyanimBasicPreyBehavior';
import PsyanimPreyAgent from '../../src/core/components/steering/agents/PsyanimPreyAgent';

export default class PreyTest extends PsyanimScene {

    static KEY = 'Prey Test'

    constructor() {

        super(PreyTest.KEY);
    }

    create() {

        super.create();

        // setup scene controls
        this.addEntity('sceneControls')
        .addComponent(PsyanimSceneTitle).entity
        .addComponent(PsyanimPhysicsSettingsController).entity
        .addComponent(PsyanimSceneChangeController);

        // create player
        this._player = this.addEntity('player', 400, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
            base: 16, altitude: 32, 
            color: 0x0000ff
        });

        let playerController = this._player.addComponent(PsyanimPlayerController);
        playerController.speed = 10;

        // setup prey agent
        this._prey = this.addEntity('predator', 100, 100, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
            base: 16, altitude: 32, color: 0xffff00
        });

        let vehicle = this._prey.addComponent(PsyanimVehicle);

        let flee = this._prey.addComponent(PsyanimFleeBehavior);
        flee.maxSpeed = 6;
        flee.maxAcceleration = 0.2;
        flee.panicDistance = 250;

        let seek = this._prey.addComponent(PsyanimSeekBehavior);
        seek.maxSpeed = 4;
        seek.maxAcceleration = 0.2;

        let wander = this._prey.addComponent(PsyanimWanderBehavior);
        wander.seekBehavior = seek;
        wander.radius = 50;
        wander.offset = 250;
        wander.maxWanderAngleChangePerFrame = 20;

        let fovSensor = this._prey.addComponent(PsyanimFOVSensor);

        let prey = this._prey.addComponent(PsyanimBasicPreyBehavior);
        prey.fleeBehavior = flee;
        prey.wanderBehavior = wander;
        prey.fovSensor = fovSensor;
        prey.subtlety = 30;
        prey.subtletyLag = 500;

        let preyAgent = this._prey.addComponent(PsyanimPreyAgent);
        preyAgent.vehicle = vehicle;
        preyAgent.preyBehavior = prey;
        preyAgent.target = this._player;
    }
}