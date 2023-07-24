import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';

import PsyanimConstants from '../../core/PsyanimConstants';

import PsyanimPhysicsSettingsController from '../../core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../core/components/controllers/PsyanimSceneController';
import PsyanimSceneTitle from '../../core/components/ui/PsyanimSceneTitle';

import PsyanimVehicle from '../../core/components/steering/PsyanimVehicle';

import PsyanimArriveBehavior from '../../core/components/steering/PsyanimArriveBehavior';

import PsyanimArriveAgent from '../../core/components/steering/agents/PsyanimArriveAgent';

import PsyanimNavigationGrid from '../../utils/PsyanimNavigationGrid';
import PsyanimPathfindingAgent from '../../core/components/pathfinding/PsyanimPathfindingAgent';

import PsyanimClickToMove from '../../core/components/controllers/PsyanimClickToMove';

export default class ClickToMoveTest extends PsyanimScene {

    constructor() {

        super('Advanced Path Following Test');
    }

    create() {

        super.create();

        this.screenBoundary.wrap = false;

        // setup scene controls
        this.addEntity('sceneControls')
            .addComponent(PsyanimSceneTitle).entity
            .addComponent(PsyanimPhysicsSettingsController).entity
            .addComponent(PsyanimSceneChangeController);

        // setup player agent
        let playerStartPosition = new Phaser.Math.Vector2(700, 100);

        this._player = this.addEntity('player', 
            playerStartPosition.x, playerStartPosition.y, 
            {
                shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
                base: 12, altitude: 24, 
                color: 0xffc0cb            
            });

        // setup pathfinding grid with obstacles
        this._grid = new PsyanimNavigationGrid(
            10,
            this.game.scale.width,
            this.game.scale.height,
        );

        let obstacle1 = this.addEntity('obstacle1', 170, 50, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 49,
            color: 0x0000ff
        },
        {
            isSleeping: true
        });

        let obstacle2 = this.addEntity('obstacle2', 170, 160, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
            base: 98, altitude: 98,
            color: 0x00ff00
        },
        {
            isSleeping: true
        });

        let obstacle3 = this.addEntity('obstacle3', 170, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 49,
            color: 0xffff00
        },
        {
            isSleeping: true
        });

        let obstacle4 = this.addEntity('obstacle4', 730, 520, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
            base: 98, altitude: 98,
            color: 0x00ffff
        },
        {
            isSleeping: true
        });

        let obstacle5 = this.addEntity('obstacle5', 400, 340, {
            shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE,
            height: 500, width: 100,
            color: 0xFFA500
        },
        {
            isSleeping: true
        });

        let obstacle6 = this.addEntity('obstacle6', 600, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 100,
            color: 0xff00ff
        },
        {
            isSleeping: true
        });

        this._grid.addObstacle(obstacle1);
        this._grid.addObstacle(obstacle2);
        this._grid.addObstacle(obstacle3);
        this._grid.addObstacle(obstacle4);
        this._grid.addObstacle(obstacle5);
        this._grid.addObstacle(obstacle6);

        this._grid.bake();

        // setup pathfinder
        this._pathfinder = this._player.addComponent(PsyanimPathfindingAgent);
        this._pathfinder.grid = this._grid;
        this._pathfinder.setDestination(playerStartPosition);

        // setup path following
        this._vehicle = this._player.addComponent(PsyanimVehicle);

        this._arriveBehavior = this._player.addComponent(PsyanimArriveBehavior);
        this._arriveBehavior.maxSpeed = 8;
        this._arriveBehavior.innerDecelerationRadius = 10;
        this._arriveBehavior.outerDecelerationRadius = 50;

        this._arriveAgent = this._player.addComponent(PsyanimArriveAgent);
        this._arriveAgent.arriveBehavior = this._arriveBehavior;
        this._arriveAgent.vehicle = this._vehicle;

        this._controller = this._player.addComponent(PsyanimClickToMove);
        this._controller.grid = this._grid;
        this._controller.pathfinder = this._pathfinder;
        this._controller.arriveAgent = this._arriveAgent;
    }
}