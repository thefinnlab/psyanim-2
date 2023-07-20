import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';
import PsyanimConstants from '../../core/PsyanimConstants';

import PsyanimPathfindingAgent from '../../core/components/pathfinding/PsyanimPathfindingAgent';
import PsyanimPathfindingRenderer from '../../core/components/rendering/PsyanimPathfindingRenderer';

import PsyanimNavigationGrid from '../../utils/PsyanimNavigationGrid';

export default class PathfindingTest extends PsyanimScene {

    static KEY = 'Pathfinding Test';

    constructor() {

        super(PathfindingTest.KEY);
    }

    create() {

        super.create();

        this._destinationPoint = new Phaser.Math.Vector2(250, 50);

        /**
         *  setup navigation grid w/ obstacles and bake it
         */
        let canvasWidth = this.game.scale.width;
        let canvasHeight = this.game.scale.height;
        let cellSize = 10;

        this._grid = new PsyanimNavigationGrid(cellSize, canvasWidth, canvasHeight);

        let obstacle1 = this.addEntity('obstacle1', 170, 50, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 49,
            color: 0x0000ff
        });

        let obstacle2 = this.addEntity('obstacle2', 170, 160, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
            base: 98, altitude: 98,
            color: 0x00ff00
        });

        let obstacle3 = this.addEntity('obstacle3', 170, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 49,
            color: 0xffff00
        });

        let obstacle4 = this.addEntity('obstacle4', 730, 520, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
            base: 98, altitude: 98,
            color: 0x00ffff
        });

        let obstacle5 = this.addEntity('obstacle5', 400, 340, {
            shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE,
            height: 500, width: 100,
            color: 0xFFA500
        });

        this._grid.addObstacle(obstacle1);
        this._grid.addObstacle(obstacle2);
        this._grid.addObstacle(obstacle3);
        this._grid.addObstacle(obstacle4);
        this._grid.addObstacle(obstacle5);

        this._grid.bake(); // baking generates masks from obstacles!

        /**
         *  setup pathfinding agents 
         */

        this._agent1 = this.addEntity('agent1', 50, 50);
        this._pathfinder1 = this._agent1.addComponent(PsyanimPathfindingAgent);
        this._pathfinder1.grid = this._grid;
        this._pathfinder1.setDestination(this._destinationPoint);

        this._agent2 = this.addEntity('agent2', 790, 590);
        this._pathfinder2 = this._agent2.addComponent(PsyanimPathfindingAgent);
        this._pathfinder2.grid = this._grid;
        this._pathfinder2.setDestination(this._destinationPoint);

        this._agent3 = this.addEntity('agent3', 50, 550);
        this._pathfinder3 = this._agent3.addComponent(PsyanimPathfindingAgent);
        this._pathfinder3.grid = this._grid;
        this._pathfinder3.setDestination(this._destinationPoint);

        /**
         *  setup renderers for each agent 
         */
        let agent1PathRenderer = this._agent1.addComponent(PsyanimPathfindingRenderer);
        agent1PathRenderer.pathfinder = this._pathfinder1;

        let agent2PathRenderer = this._agent2.addComponent(PsyanimPathfindingRenderer);
        agent2PathRenderer.pathfinder = this._pathfinder2;
        agent2PathRenderer.pathColor = 0xff0000;

        let agent3PathRenderer = this._agent3.addComponent(PsyanimPathfindingRenderer);
        agent3PathRenderer.pathfinder = this._pathfinder3;
        agent3PathRenderer.pathColor = 0x008000;

        /**
         *  setup keyboard controls for testing
         */
        this._keys = {
            W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };
    }

    update(t, dt) {

        super.update(t, dt);

        // console.log(this._destinationPoint);

        if (Phaser.Input.Keyboard.JustDown(this._keys.W))
        {
            let newDestination = this._destinationPoint.clone()
                .add(new Phaser.Math.Vector2(0, -this._grid.cellSize));

            if (this._grid.isWorldPointInWalkableRegion(newDestination))
            {
                this._destinationPoint = newDestination;
            }

            this._pathfinder3.setDestination(this._destinationPoint);
        }
        else if (Phaser.Input.Keyboard.JustDown(this._keys.S))
        {
            let newDestination = this._destinationPoint.clone()
                .add(new Phaser.Math.Vector2(0, this._grid.cellSize));

            if (this._grid.isWorldPointInWalkableRegion(newDestination))
            {
                this._destinationPoint = newDestination;
            }    

            this._pathfinder3.setDestination(this._destinationPoint);
        }
        else if (Phaser.Input.Keyboard.JustDown(this._keys.A))
        {
            let newDestination = this._destinationPoint.clone()
                .add(new Phaser.Math.Vector2(-this._grid.cellSize, 0));

            if (this._grid.isWorldPointInWalkableRegion(newDestination))
            {
                this._destinationPoint = newDestination;
            }    
    
            this._pathfinder3.setDestination(this._destinationPoint);
        }
        else if (Phaser.Input.Keyboard.JustDown(this._keys.D))
        {
            let newDestination = this._destinationPoint.clone()
                .add(new Phaser.Math.Vector2(this._grid.cellSize, 0));

            if (this._grid.isWorldPointInWalkableRegion(newDestination))
            {
                this._destinationPoint = newDestination;
            }    
    
            this._pathfinder3.setDestination(this._destinationPoint);
        }
    }
}