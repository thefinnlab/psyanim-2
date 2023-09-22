import Phaser from 'phaser';

import PsyanimComponent from "../../PsyanimComponent";

export default class PsyanimMultiRaySensorRenderer extends PsyanimComponent {

    raySensor;

    lineWidth;
    lineAlpha;

    constructor(entity) {

        super(entity);

        this.lineWidth = 2;
        this.lineAlpha = 0.6;

        this._graphics = this.entity.scene.add.graphics();
    }

    afterCreate() {

        this._line = new Phaser.Geom.Line(0, 0, 0, 0);
    }

    _drawLine(color) {

        this._graphics.lineStyle(this.lineWidth, color, this.lineAlpha);

        this._graphics.strokeLineShape(this._line);
    }

    update(t, dt) {

        super.update(t, dt);

        this._graphics.clear();

        for (let ray of this.raySensor.rayMap.values())
        {
            this._line.setTo(
                ray.startPoint.x, ray.startPoint.y,
                ray.endPoint.x, ray.endPoint.y
            );

            if (ray.isTriggered)
            {
                this._drawLine(0x00ff00);
            }
            else
            {
                this._drawLine(0xff0000);
            }
        }
    }
}