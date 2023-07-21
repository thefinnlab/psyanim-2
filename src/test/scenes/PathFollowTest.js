import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';
import PsyanimConstants from '../../core/PsyanimConstants';
import PsyanimPathFollowBehavior from '../../core/components/steering/PsyanimPathFollowBehavior';
import PsyanimVehicle from '../../core/components/steering/PsyanimVehicle';
import PsyanimPathFollowAgent from '../../core/components/steering/agents/PsyanimPathFollowAgent';
import PsyanimSeekBehavior from '../../core/components/steering/PsyanimSeekBehavior';

import PsyanimPathfindingRenderer from '../../core/components/rendering/PsyanimPathfindingRenderer';

import PsyanimPhysicsSettingsController from '../../core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../core/components/controllers/PsyanimSceneController';

import PsyanimSceneTitle from '../../core/components/ui/PsyanimSceneTitle';

export default class PathFollowTest extends PsyanimScene {

    constructor() {

        super('Path Follow Test');
    }

    create() {

        super.create();

        // setup scene controls
        this.addEntity('sceneControls')
            .addComponent(PsyanimSceneTitle).entity
            .addComponent(PsyanimPhysicsSettingsController).entity
            .addComponent(PsyanimSceneChangeController);

        // setup keyboard controls for testing
        this._testKeys = {
            U: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U),
            I: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I),
        };

        // create agent that follows a path
        this.agent = this.addEntity('agent', 400, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
            base: 16, altitude: 32, 
            color: 0xffc0cb            
        });

        let vehicle = this.agent.addComponent(PsyanimVehicle);
        vehicle.turnSpeed = Infinity;
        vehicle.maxSpeed = 3;

        let seek = this.agent.addComponent(PsyanimSeekBehavior);

        let pathfinder = {
            currentPath: [
                new Phaser.Math.Vector2(30, 430),
                new Phaser.Math.Vector2(770, 370)
            ]
        }

        this.pathFollow = this.agent.addComponent(PsyanimPathFollowBehavior);
        this.pathFollow.p1 = pathfinder.currentPath[0];
        this.pathFollow.p2 = pathfinder.currentPath[1];
        this.pathFollow.seekBehavior = seek;

        let pathFollowAgent = this.agent.addComponent(PsyanimPathFollowAgent);
        pathFollowAgent.vehicle = vehicle;
        pathFollowAgent.pathFollowBehavior = this.pathFollow;

        // setup path renderer
        this.pathRenderer = this.agent.addComponent(PsyanimPathfindingRenderer);
        this.pathRenderer.pathfinder = pathfinder;
    }

    update(t, dt) {

        super.update(t, dt);

        // process control inputs
        if (Phaser.Input.Keyboard.JustDown(this._testKeys.U))
        {
            this.pathRenderer.enabled = false;
        }
        else if (Phaser.Input.Keyboard.JustDown(this._testKeys.I))
        {
            this.pathRenderer.enabled = true;
        }
    }
}