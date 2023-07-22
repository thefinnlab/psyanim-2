import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

export default class PsyanimLineRenderer extends PsyanimComponent {

    originPoint = new Phaser.Math.Vector2(0, 0);
    endPoint = new Phaser.Math.Vector2(100, 0);

    lineColor = 0xa020f0;
    lineWidth = 2;

    alpha = 0.6;

    constructor(entity) {

        super(entity);

        this.graphics = entity.scene.add.graphics();

        this._line = new Phaser.Geom.Line(
            this.originPoint.x, this.originPoint.y,
            this.endPoint.x, this.endPoint.y);
    }

    onDisable() {

        super.onDisable();

        this.graphics.clear();
    }

    update(t, dt) {

        super.update(t, dt);

        this.graphics.clear();

        this.graphics.lineStyle(this.lineWidth, this.lineColor, this.alpha);

        this._line.setTo(
            this.originPoint.x, this.originPoint.y,
            this.endPoint.x, this.endPoint.y);

        this.graphics.strokeLineShape(this._line);
    }
}