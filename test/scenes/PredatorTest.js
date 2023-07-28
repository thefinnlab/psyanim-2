import PsyanimScene from "../../src/core/scene/PsyanimScene";

import PsyanimConstants from "../../src/core/PsyanimConstants";

import PsyanimSceneTitle from "../../src/core/components/ui/PsyanimSceneTitle";
import PsyanimPhysicsSettingsController from "../../src/core/components/controllers/PsyanimPhysicsSettingsController";
import PsyanimSceneChangeController from "../../src/core/components/controllers/PsyanimSceneController";

import PsyanimPlayerController from "../../src/core/components/controllers/PsyanimPlayerController";

import PsyanimArriveBehavior from "../../src/core/components/steering/PsyanimArriveBehavior";
import PsyanimSeekBehavior from "../../src/core/components/steering/PsyanimSeekBehavior";
import PsyanimWanderBehavior from "../../src/core/components/steering/PsyanimWanderBehavior";

import PsyanimFOVSensor from "../../src/core/components/physics/PsyanimFOVSensor";

import PsyanimBasicPredatorBehavior from "../../src/core/components/steering/PsyanimBasicPredatorBehavior";
import PsyanimPredatorAgent from "../../src/core/components/steering/agents/PsyanimPredatorAgent";
import PsyanimVehicle from "../../src/core/components/steering/PsyanimVehicle";

export default class PredatorTest extends PsyanimScene {

    static KEY = 'Predator Test';

    constructor() {

        super(PredatorTest.KEY);
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

        // setup predator agent
        this._predator = this.addEntity('predator', 100, 100, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
            base: 16, altitude: 32, color: 0xffff00
        });

        let vehicle = this._predator.addComponent(PsyanimVehicle);

        let arrive = this._predator.addComponent(PsyanimArriveBehavior);
        arrive.maxSpeed = 6;
        arrive.maxAcceleration = 0.2;
        arrive.innerDecelerationRadius = 16;
        arrive.outerDecelerationRadius = 40;

        let seek = this._predator.addComponent(PsyanimSeekBehavior);
        seek.maxSpeed = 4;
        seek.maxAcceleration = 0.2;

        let wander = this._predator.addComponent(PsyanimWanderBehavior);
        wander.seekBehavior = seek;
        wander.radius = 50;
        wander.offset = 250;
        wander.maxWanderAngleChangePerFrame = 20;

        let fovSensor = this._predator.addComponent(PsyanimFOVSensor);

        let predator = this._predator.addComponent(PsyanimBasicPredatorBehavior);
        predator.arriveBehavior = arrive;
        predator.wanderBehavior = wander;
        predator.fovSensor = fovSensor;
        predator.subtlety = 30;
        predator.subtletyLag = 500;

        let predatorAgent = this._predator.addComponent(PsyanimPredatorAgent);
        predatorAgent.vehicle = vehicle;
        predatorAgent.predatorBehavior = predator;
        predatorAgent.target = this._player;
    }
}