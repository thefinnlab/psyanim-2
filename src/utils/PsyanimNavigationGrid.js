 export default class PsyanimNavigationGrid {
    
    constructor(nRows, nColumns, cellSize) {

        this._cellSize = cellSize;
        this._nRows = nRows;
        this._nColumns = nColumns;

        this._grid = [];
        
        for (let i = 0; i < nRows; ++i)
        {
            let row = [];

            for (let j = 0; j < nColumns; ++j)
            {
                row.push(0);
            }

            this._grid.push(row);
        }

        console.log('initialized grid o/');
    }

    clone() {

        let grid = [];

        for (let i = 0; i < this._nRows; ++i)
        {
            let row = [];

            for (let j = 0; j < this._nColumns; ++j)
            {
                row.push(this._grid[i][j]);
            }

            grid.push(row);
        }

        return grid;
    }

    get matrix() {

        return this._grid;
    }

    setGridValue(row, column, value) {

        if (row >= this._nRows)
        {
            console.error("ERROR: row index out of bounds: " + row);
        }

        if (column >= this._nColumns)
        {
            console.error("ERROR: column index out of bounds: " + column);
        }

        this._grid[row][column] = value;
    }

    convertToGridFromWorldCoords(point) {

        let xRaw = point.x / this._cellSize;
        let yRaw = point.y / this._cellSize;

        // if ()

        let x = Math.floor(point.x / this._cellSize);
        let y = Math.floor(point.y / this._cellSize);
        
        return { x: x, y: y };
    }

    createObstacleFromEntityBounds(entity) {

        // min / max XY values of bounds in world coords
        let minXYWorld = entity.body.bounds.min;
        let maxXYWorld = entity.body.bounds.max;

        console.log('minXYWorld = ' + JSON.stringify(minXYWorld));
        console.log('maxXYWorld = ' + JSON.stringify(maxXYWorld));

        let minXY = this.convertToGridFromWorldCoords(minXYWorld);
        let maxXY = this.convertToGridFromWorldCoords(maxXYWorld);

        console.log('minXY = ' + JSON.stringify(minXY));
        console.log('maxXY = ' + JSON.stringify(maxXY));

        for (let i = minXY.x; i <= maxXY.x; ++i)
        {
            for (let j = minXY.y; j <= maxXY.y; ++j)
            {
                this._grid[j][i] = 1; // need to transpose the bounds in our grid matrix!
            }
        }
    }
}