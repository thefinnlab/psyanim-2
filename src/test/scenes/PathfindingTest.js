import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';

import PsyanimPathfindingAgent from '../../core/components/pathfinding/PsyanimPathfindingAgent';
import PsyanimPathfindingRenderer from '../../core/components/rendering/PsyanimPathfindingRenderer';

export default class PathfindingTest extends PsyanimScene {

    static KEY = 'Pathfinding Test';

    constructor() {

        super(PathfindingTest.KEY);
    }

    create() {

        super.create();

        let pathfinder = this.addEntity('pathfindingRenderer');

        let pathfindingRenderer = pathfinder.addComponent(PsyanimPathfindingRenderer);

        // let rows = gridHeight / cellSize;
        // let cols = gridWidth / cellSize;

        let matrix = [
            [0, 0, 0, 1, 0],
            [1, 0, 0, 0, 1],
            [0, 0, 1, 0, 0],
        ];

        let pathfindingAgent = pathfinder.addComponent(PsyanimPathfindingAgent);

        pathfindingAgent.gridMatrix = matrix;

        let startPoint = new Phaser.Math.Vector2(1, 2);
        let endPoint = new Phaser.Math.Vector2(4, 2);

        let path = pathfindingAgent.computePath(startPoint, endPoint);

        console.log(path);
    }

    update(t, dt) {

        super.update(t, dt);
    }
}