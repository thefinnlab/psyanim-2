import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

export default class PsyanimLineRenderer extends PsyanimComponent {

    originPoint = new Phaser.Math.Vector2(0, 0);
    endPoint = new Phaser.Math.Vector2(100, 0);

    constructor(entity) {

        super(entity);

        this.graphics = entity.scene.add.graphics({ lineStyle: { width: 2, color: 0xa020f0, alpha: 0.6 } });

        this._line = new Phaser.Geom.Line(
            this.originPoint.x, this.originPoint.y,
            this.endPoint.x, this.endPoint.y);
    }

    update(t, dt) {

        super.update(t, dt);

        this._line.setTo(
            this.originPoint.x, this.originPoint.y,
            this.endPoint.x, this.endPoint.y);

        this.graphics.clear();

        this.graphics.strokeLineShape(this._line);
    }
}