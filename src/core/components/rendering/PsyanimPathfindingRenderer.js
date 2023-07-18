import PsyanimComponent from "../../PsyanimComponent";

export default class PsyanimPathfindingRenderer extends PsyanimComponent {

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

        this._pathGraphics = this.add.graphics({
            lineStyle: {
                width: 4, color: 0xaa00aa
            }
        });
    }

    update(t, dt) {

        super.update(t, dt);

        this._pathGraphics.clear();

    }
}