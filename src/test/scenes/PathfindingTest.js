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

        // setup pathfinding agent
        let pathfinder = this.addEntity('pathfindingRenderer', 50, 50);

        // let matrix = [
        //     [0, 0, 0, 1, 0],
        //     [1, 0, 0, 0, 1],
        //     [0, 0, 1, 0, 0],
        // ];

        let pathfindingAgent = pathfinder.addComponent(PsyanimPathfindingAgent);

        // setup navigation grid w/ obstacles masked out
        let obstacle = this.addEntity('obstacle', 170, 50, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 49,
            color: 0x0000ff
        });

        console.log("bounds min = " + JSON.stringify(obstacle.body.bounds.min));
        console.log("bounds max = " + JSON.stringify(obstacle.body.bounds.max));

        let grid = new PsyanimNavigationGrid(
            pathfindingAgent.gridWidth, 
            pathfindingAgent.gridHeight,
            pathfindingAgent.cellSize);

        grid.createObstacleFromEntityBounds(obstacle);

        pathfindingAgent.grid = grid;

        console.log(grid.matrix);

        let destinationPoint = new Phaser.Math.Vector2(12, 2);

        pathfindingAgent.setDestination(destinationPoint);

        // setup path renderer
        let pathfindingRenderer = pathfinder.addComponent(PsyanimPathfindingRenderer);

        pathfindingRenderer.pathfindingAgent = pathfindingAgent;
    }

    update(t, dt) {

        super.update(t, dt);
    }
}