import PsyanimComponent from '../../PsyanimComponent';

import Pathfinding from 'pathfinding';

export default class PsyanimPathfindingAgent extends PsyanimComponent {

    gridMatrix = null;

    destination = null;

    cellSize = 20;

    constructor(entity) {

        super(entity);

        this._finder = new Pathfinding.AStarFinder();

        this._gridWidth = this.scene.game.scale.width;
        this._gridHeight = this.scene.game.scale.height;
    }

    
    
    computePath(startPoint, endPoint) {

        // TODO: check if gridMatrix is null and startPoint & endPoint are walkable!

        let pathfindingGrid = new Pathfinding.Grid(this.gridMatrix);

        return this._finder.findPath(
            startPoint.x, startPoint.y,
            endPoint.x, endPoint.y,
            pathfindingGrid);
    }
}