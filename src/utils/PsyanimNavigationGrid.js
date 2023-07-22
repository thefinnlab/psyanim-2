 import PsyanimPath from "./PsyanimPath.mjs";
 
 export default class PsyanimNavigationGrid {
    
    constructor(cellSize, canvasWidth, canvasHeight) {

        if (canvasWidth % cellSize != 0)
        {
            console.error("ERROR: canvas width must be an integer multiple of cell size!");
        }

        if (canvasHeight % cellSize != 0)
        {
            console.error("ERROR: canvas height must be an integer multiple of cell size!");
        }

        this._obstacles = [];

        this._cellSize = cellSize;

        this._canvasWidth = canvasWidth;
        this._canvasHeight = canvasHeight;

        this._grid = [];
        
        for (let i = 0; i < this.rows; ++i)
        {
            let row = [];

            for (let j = 0; j < this.columns; ++j)
            {
                row.push(0);
            }

            this._grid.push(row);
        }
    }

    get rows() {

        return Math.floor(this._canvasHeight / this._cellSize);
    }

    get columns() {

        return Math.floor(this._canvasWidth / this._cellSize);
    }

    get cellSize() {

        return this._cellSize;
    }

    get matrix() {

        return this._grid;
    }

    addObstacle(entity) {

        this._obstacles.push(entity);
    }

    bake() {

        for (let i = 0; i < this._obstacles.length; ++i)
        {
            this._createObstacleFromEntityBounds(this._obstacles[i]);
        }
    }

    isWorldPointInWalkableRegion(point) {

        let gridPoint = this.convertToGridFromWorldCoords(point);

        if (gridPoint.x < 0 || gridPoint.x >= this.columns)
        {
            return false;
        }
        else if (gridPoint.y < 0 || gridPoint.y >= this.rows)
        {
            return false;
        }

        if (this._grid[gridPoint.y][gridPoint.x] == 0)
        {
            return true;
        }

        return false;
    }

    convertToGridFromWorldCoords(point) {

        let x = Math.floor(point.x / this._cellSize);
        let y = Math.floor(point.y / this._cellSize);
        
        return { x: x, y: y };
    }

    convertToWorldCoordsFromGrid(point) {

        let x = (point.x + 0.5) * this._cellSize;
        let y = (point.y + 0.5) * this._cellSize;

        return { x: x, y: y };
    }

    computeWorldPathFromGridPath(gridPath) {

        let worldPathVertices = [];

        for (let i = 0; i < gridPath.length; ++i)
        {
            let gridPoint = gridPath[i];

            let worldPoint = this.convertToWorldCoordsFromGrid({
                x: gridPoint[0],
                y: gridPoint[1]
            });

            worldPathVertices.push(worldPoint);
        }

        let worldPath = new PsyanimPath(worldPathVertices);

        return worldPath;
    }

    _createObstacleFromEntityBounds(entity) {

        // min / max XY values of bounds in world coords
        let minXYWorld = entity.body.bounds.min;
        let maxXYWorld = entity.body.bounds.max;

        let minXY = this.convertToGridFromWorldCoords(minXYWorld);
        let maxXY = this.convertToGridFromWorldCoords(maxXYWorld);

        for (let i = minXY.x; i <= maxXY.x; ++i)
        {
            for (let j = minXY.y; j <= maxXY.y; ++j)
            {
                this._setGridValue(j, i, 1);
            }
        }
    }

    _setGridValue(row, column, value) {

        if (row >= this.rows)
        {
            console.error("ERROR: row index out of bounds: " + row + "... row count = " + this.rows);
        }

        if (column >= this.columns)
        {
            console.error("ERROR: column index out of bounds: " + column + "... column count = " + this.columns);
        }

        this._grid[row][column] = value;
    }
}