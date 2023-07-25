import PsyanimComponent from '../../PsyanimComponent';

import Pathfinding from 'pathfinding';

export default class PsyanimPathfindingAgent extends PsyanimComponent {

    grid = null;

    constructor(entity) {

        super(entity);

        this._finder = new Pathfinding.AStarFinder({
            allowDiagonal: true,
            dontCrossCorners: true
        });

        this._canvasWidth = this.scene.game.scale.width;
        this._canvasHeight = this.scene.game.scale.height;
    }

    get currentPath() {

        return this._currentPath;
    }

    setDestination(destinationPoint) {

        if (destinationPoint == null) {
            this._currentPath = null;
        }

        // check if destinationPoint is inside the canvas
        if (destinationPoint.x >= this._canvasWidth || destinationPoint.x < 0.0)
        {
            console.warn("destination is not on canvas! destinationPoint = " + JSON.stringify(destinationPoint));
            this._currentPath = null;
            return;
        }

        if (destinationPoint.y >= this._canvasHeight || destinationPoint.y < 0.0)
        {
            console.warn("destination is not on canvas! destinationPoint = " + JSON.stringify(destinationPoint));
            this._currentPath = null;
            return;
        }

        // TODO: for shapes where the entity collider has a different area than the AABB collider,
        // we should to move our 'entityPositionOnGrid' to closest corner of the AABB or pathfinding will fail!

        let pathfindingGrid = new Pathfinding.Grid(this.grid.matrix);

        let entityPositionOnGrid = this.grid.convertToGridFromWorldCoords(this.entity.position);
        let destinationPositionOnGrid = this.grid.convertToGridFromWorldCoords(destinationPoint);

        let gridPath = this._finder.findPath(
            entityPositionOnGrid.x, entityPositionOnGrid.y,
            destinationPositionOnGrid.x, destinationPositionOnGrid.y,
            pathfindingGrid);

        if (gridPath.length == 0)
        {
            console.warn("No viable path found to destination!");
            this._currentPath = null;
        }
        else
        {
            let smoothedGridPath = Pathfinding.Util.smoothenPath(pathfindingGrid, gridPath);

            this._currentPath = this.grid.computeWorldPathFromGridPath(smoothedGridPath);
        }
    }
}