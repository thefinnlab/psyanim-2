import Phaser from 'phaser';

import PsyanimScene from "../../core/scene/PsyanimScene";

import PsyanimConstants from '../../core/PsyanimConstants';
import PsyanimPlayerController from '../../core/components/controllers/PsyanimPlayerController';

import PsyanimVehicle from '../../core/components/steering/PsyanimVehicle';
import PsyanimWanderBehavior from '../../core/components/steering/PsyanimWanderBehavior';
import PsyanimPlayfightBehavior from '../../core/components/steering/PsyanimPlayfightBehavior';

import PsyanimPhysicsSettingsController from '../../core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../core/components/controllers/PsyanimSceneController';

import PsyanimSceneTitle from '../../core/components/ui/PsyanimSceneTitle';

export default class PsyanimInteractivePlayfightTest extends PsyanimScene {

    constructor() {

        super('Interactive Playfight Test');
    }

    create() {

        super.create();

        // setup scene controls
        this.addEntity('sceneControls')
            .addComponent(PsyanimSceneTitle).entity
            .addComponent(PsyanimPhysicsSettingsController).entity
            .addComponent(PsyanimSceneChangeController);

        // create player
        this.player = this.addEntity('player', 400, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
            base: 16, altitude: 32, color: 0x0000ff });

        this.player.addComponent(PsyanimPlayerController);

        // add agents as vehicles to this scene
        let wanderAgent = this.addEntity('wanderAgent', 0, 0, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
            base: 16, altitude: 32, color: 0xff0000         
        });

        let wanderTarget = this.addEntity('wanderTarget', 0, 0, { isEmpty: true });

        this.wanderVehicle = wanderAgent.addComponent(PsyanimVehicle);
        this.wanderVehicle.target = wanderTarget;
        this.wanderVehicle.setState(PsyanimVehicle.STATE.SEEK);

        this.wanderVehicle.innerDecelerationRadius = 12;
        this.wanderVehicle.outerDecelerationRadius = 30;

        this.wander = wanderAgent.addComponent(PsyanimWanderBehavior);
        this.wander.vehicle = this.wanderVehicle;
        this.wander.target = wanderTarget;
        this.wander.maxSpeed = 4;

        this.playfight = wanderAgent.addComponent(PsyanimPlayfightBehavior);
        this.playfight.vehicle = this.wanderVehicle;
        this.playfight.wander = this.wander;
        this.playfight.setChargeTarget(this.player);

        // this.screenBoundary.wrap = false;
    }

    update(t, dt) {

        super.update(t, dt);
    }
}