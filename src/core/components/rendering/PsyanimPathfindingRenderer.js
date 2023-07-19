import Phaser from 'phaser';

import PsyanimComponent from "../../PsyanimComponent";
import PsyanimPathfindingAgent from '../pathfinding/PsyanimPathfindingAgent';

export default class PsyanimPathfindingRenderer extends PsyanimComponent {

    pathfindingAgent = null;

    constructor(entity) {

        super(entity);

        this._gridWidth = this.scene.game.scale.width;
        this._gridHeight = this.scene.game.scale.height;

        this._cellSize = 20;

        this._grid = this.scene.add.grid(
            this._gridWidth / 2, this._gridHeight / 2,
            this._gridWidth, this._gridHeight,
            this._cellSize, this._cellSize,
            0xffffff, 0.0, 0x000000, 0.3
        );

        this._pathGraphics = this.entity.scene.add.graphics({
            lineStyle: {
                width: 4, color: 0xBF40BF
            }
        });

        this._line = new Phaser.Geom.Line(0, 0, 0, 0);

        this._pathPoints = [];
    }

    _updatePathPoints() {

        this._pathPoints = [];

        let currentPath = this.pathfindingAgent.currentPath;

        if (currentPath)
        {
            currentPath.forEach(pt => this._pathPoints.push(pt));
        }
    }

    update(t, dt) {

        super.update(t, dt);

        this._updatePathPoints();

        this._pathGraphics.clear();

        for (let i = 1; i < this._pathPoints.length; ++i)
        {
            let fromPoint = this._pathPoints[i-1];
            let toPoint = this._pathPoints[i];

            this._line.setTo(
                fromPoint.x, fromPoint.y,
                toPoint.x, toPoint.y
            );

            this._pathGraphics.strokeLineShape(this._line);
        }
    }
}