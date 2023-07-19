import PsyanimComponent from '../../PsyanimComponent';

import Pathfinding from 'pathfinding';

export default class PsyanimPathfindingAgent extends PsyanimComponent {

    grid = null;

    destination = null;

    cellSize = 20;

    constructor(entity) {

        super(entity);

        this._finder = new Pathfinding.AStarFinder();

        this._canvasWidth = this.scene.game.scale.width;
        this._canvasHeight = this.scene.game.scale.height;
    }

    get currentPath() {

        return this._currentPath;
    }

    get gridWidth() {

        return Math.floor(this._canvasWidth / this.cellSize);
    }

    get gridHeight() {

        return Math.floor(this._canvasHeight / this.cellSize);
    }

    _computeWorldPathFromGridPath(gridPath) {

        let worldPath = [];

        for (let i = 0; i < gridPath.length; ++i)
        {
            let gridPoint = gridPath[i];
            
            let worldPoint = {
                x: (gridPoint[0] + 0.5) * this.cellSize,
                y: (gridPoint[1] + 0.5) * this.cellSize
            };

            worldPath.push(worldPoint);
        }

        return worldPath;
    }

    setDestination(destinationPoint) {

        if (destinationPoint == null) {
            this._currentPath = null;
        }

        let pathfindingGrid = new Pathfinding.Grid(this.grid.matrix);

        let entityPositionOnGrid = this.grid.convertToGridFromWorldCoords(this.entity.position);

        console.log('entity pos on grid = ' + JSON.stringify(entityPositionOnGrid));

        let gridPath = this._finder.findPath(
            entityPositionOnGrid.x, entityPositionOnGrid.y,
            destinationPoint.x, destinationPoint.y,
            pathfindingGrid);

        // let gridPath = [
        //     [2, 2],
        //     [6, 2],
        //     [6, 6],
        //     [12, 6],
        //     [12, 2],
        // ];

        console.log(gridPath);

        this._currentPath = this._computeWorldPathFromGridPath(gridPath);
    }
}