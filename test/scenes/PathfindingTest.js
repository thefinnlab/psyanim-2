import Phaser from 'phaser';

import PsyanimScene from '../../src/core/PsyanimScene.js';
import PsyanimConstants from '../../src/core/PsyanimConstants.js';

import PsyanimPathfindingAgent from '../../src/core/components/pathfinding/PsyanimPathfindingAgent.js';
import PsyanimPathfindingRenderer from '../../src/core/components/rendering/PsyanimPathfindingRenderer.js';

import TestGridWithObstacles from '../utils/TestGridWithObstacles.js';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController.js';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController.js';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle.js';

import PsyanimMouseFollowTarget from '../../src/core/components/controllers/PsyanimMouseFollowTarget.js';

import PsyanimLineRenderer from '../../src/core/components/rendering/PsyanimLineRenderer.js';

export default class PathfindingTest extends PsyanimScene {

    static KEY = 'Pathfinding Test';

    constructor() {

        super(PathfindingTest.KEY);
    }

    create() {

        super.create();

        // setup scene controls
        this.addEntity('sceneControls')
            .addComponent(PsyanimSceneTitle).entity
            .addComponent(PsyanimPhysicsSettingsController).entity
            .addComponent(PsyanimSceneChangeController);

        // setup mouse follow target
        this._mouseTarget = this.addEntity('mouseFollowTarget', 400, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 4,
            color: 0x00ff00
        });

        this._mouseTarget.addComponent(PsyanimMouseFollowTarget, { radius: 4 });

        /**
         *  setup navigation grid w/ obstacles and bake it
         */
        this._grid = TestGridWithObstacles.create(this);

        /**
         *  setup pathfinding agents 
         */

        this._destinationPoint1 = new Phaser.Math.Vector2(250, 50);
        this._destinationPoint2 = new Phaser.Math.Vector2(250, 50);
        this._destinationPoint3 = new Phaser.Math.Vector2(250, 50);

        this._agent1 = this.addEntity('agent1', 50, 50);
        this._pathfinder1 = this._agent1.addComponent(PsyanimPathfindingAgent);
        this._pathfinder1.grid = this._grid;
        this._pathfinder1.setDestination(this._destinationPoint1);

        this._agent2 = this.addEntity('agent2', 790, 590);
        this._pathfinder2 = this._agent2.addComponent(PsyanimPathfindingAgent);
        this._pathfinder2.grid = this._grid;
        this._pathfinder2.setDestination(this._destinationPoint2);

        this._agent3 = this.addEntity('agent3', 50, 550);
        this._pathfinder3 = this._agent3.addComponent(PsyanimPathfindingAgent);
        this._pathfinder3.grid = this._grid;
        this._pathfinder3.setDestination(this._destinationPoint3);

        /**
         *  setup renderers for each agent 
         */
        this._agent1PathRenderer = this._agent1.addComponent(PsyanimPathfindingRenderer);
        this._agent1PathRenderer.pathfinder = this._pathfinder1;
        this._agent1PathRenderer.setGridVisible(true);

        this._agent1PathRenderer.setLineDepth(2);
        this._agent1PathRenderer.setRadiusDepth(1);

        this._agent2PathRenderer = this._agent2.addComponent(PsyanimPathfindingRenderer);
        this._agent2PathRenderer.pathfinder = this._pathfinder2;
        this._agent2PathRenderer.pathColor = 0xff0000;
        this._agent2PathRenderer.setGridVisible(true);

        this._agent3PathRenderer = this._agent3.addComponent(PsyanimPathfindingRenderer);
        this._agent3PathRenderer.pathfinder = this._pathfinder3;
        this._agent3PathRenderer.pathColor = 0x008000;
        this._agent3PathRenderer.setGridVisible(true);

        this._pathVisualizationEnabled = true;

        // setup seek target
        this._pathFollowingTarget = this.addEntity('pathFollowingTarget', 700, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 4,
            color: 0xFFA500
        });

        this._pathFollowingTarget.depth = 3;

        // setup line renderer showing closest point to mouse cursor on closest path segment
        this._closestPointRenderer = this.addEntity('closestPointRenderer')
            .addComponent(PsyanimLineRenderer);

        this._closestPointRenderer.lineColor = 0xff0000;

        /**
         *  setup keyboard controls for testing
         */
        this._keys = {
            W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            O: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O)
        };

        this.input.on('pointerup', (pointer) => {

            if (pointer.leftButtonReleased())
            {
                let newDestination = new Phaser.Math.Vector2(pointer.x, pointer.y);

                if (this._grid.isWorldPointInWalkableRegion(newDestination))
                {
                    // this is the code that would be executed by a unit that uses the pathfinding agent,
                    // such as a PathFollowing agent.
                    this._destinationPoint1 = newDestination;
                    this._pathfinder1.setDestination(newDestination);
                }
            }
        });
    }

    _computePathfollowingTargetLocation() {

        let targetPositionOffset = 50;
        let targetParameterOffset = targetPositionOffset / this._pathfinder1.currentPath.getTotalLength();

        let parameter = this._pathfinder1.currentPath
            .getParameter(this._mouseTarget.position);

        let targetParameter = parameter + targetParameterOffset;

        let targetPosition = this._pathfinder1.currentPath
            .getPosition(targetParameter);

        this._pathFollowingTarget.x = targetPosition.x;
        this._pathFollowingTarget.y = targetPosition.y;
    }

    _updateClosestPointToMouseCursor() {

        let mousePos = this._mouseTarget.position;

        let closestPoint = this._pathfinder1.currentPath.getClosestPoint(mousePos);

        this._closestPointRenderer.originPoint = mousePos;
        this._closestPointRenderer.endPoint = closestPoint;
    }

    update(t, dt) {

        this._computePathfollowingTargetLocation();
        this._updateClosestPointToMouseCursor();

        super.update(t, dt);

        if (Phaser.Input.Keyboard.JustDown(this._keys.O))
        {
            this._pathVisualizationEnabled = !this._pathVisualizationEnabled;

            this._agent1PathRenderer.enabled = this._pathVisualizationEnabled;            
            this._agent2PathRenderer.enabled = this._pathVisualizationEnabled;            
            this._agent3PathRenderer.enabled = this._pathVisualizationEnabled;            
        }

        if (Phaser.Input.Keyboard.JustDown(this._keys.W))
        {
            let newDestination = this._destinationPoint3.clone()
                .add(new Phaser.Math.Vector2(0, -this._grid.cellSize));

            if (this._grid.isWorldPointInWalkableRegion(newDestination))
            {
                this._destinationPoint3 = newDestination;
            }

            this._pathfinder3.setDestination(this._destinationPoint3);
        }
        else if (Phaser.Input.Keyboard.JustDown(this._keys.S))
        {
            let newDestination = this._destinationPoint3.clone()
                .add(new Phaser.Math.Vector2(0, this._grid.cellSize));

            if (this._grid.isWorldPointInWalkableRegion(newDestination))
            {
                this._destinationPoint3 = newDestination;
            }    

            this._pathfinder3.setDestination(this._destinationPoint3);
        }
        else if (Phaser.Input.Keyboard.JustDown(this._keys.A))
        {
            let newDestination = this._destinationPoint3.clone()
                .add(new Phaser.Math.Vector2(-this._grid.cellSize, 0));

            if (this._grid.isWorldPointInWalkableRegion(newDestination))
            {
                this._destinationPoint3 = newDestination;
            }    
    
            this._pathfinder3.setDestination(this._destinationPoint3);
        }
        else if (Phaser.Input.Keyboard.JustDown(this._keys.D))
        {
            let newDestination = this._destinationPoint3.clone()
                .add(new Phaser.Math.Vector2(this._grid.cellSize, 0));

            if (this._grid.isWorldPointInWalkableRegion(newDestination))
            {
                this._destinationPoint3 = newDestination;
            }    
    
            this._pathfinder3.setDestination(this._destinationPoint3);
        }
    }
}