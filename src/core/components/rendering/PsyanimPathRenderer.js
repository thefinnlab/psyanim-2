import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

export default class PsyanimPathRenderer extends PsyanimComponent {

    lineWidth = 4;
    radius = 20;

    lineColor = 0x000000;
    radiusColor = 0x808080;

    p1 = new Phaser.Math.Vector2(0, 0);
    p2 = new Phaser.Math.Vector2(1, 0);

    constructor(entity) {

        super(entity);

        this._lineGraphics = this.entity.scene.add.graphics({ lineStyle: { width: this.lineWidth, color: this.lineColor } });
        this._radiusGraphics = this.entity.scene.add.graphics({ lineStyle: { width: this.radius, color: this.radiusColor } });

        this._lineGraphics.depth = -1;
        this._radiusGraphics.depth = -2;

        this._line = new Phaser.Geom.Line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
        this._radius = new Phaser.Geom.Line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
    }

    onDisable() {
        this.clear();
    }

    clear() {

        this._lineGraphics.clear();
        this._radiusGraphics.clear();
    }

    setRadius(value) {

        if (this.radius == value) {
            return;
        }

        this.radius = value;

        // TODO: lineStyle() not working here, so we have to rebuild graphics for now
        // this._radiusGraphics.lineStyle(value, this.radiusColor);

        this._radiusGraphics.destroy();

        this._radiusGraphics = this.entity.scene.add.graphics({ lineStyle: { width: this.radius, color: this.radiusColor } });
        this._radiusGraphics.depth = -2;
    }

    update(t, dt) {

        super.update(t, dt);

        // update line and radius state
        this._line.x1 = this.p1.x;
        this._line.y1 = this.p1.y;
        this._line.x2 = this.p2.x;
        this._line.y2 = this.p2.y;

        this._radius.x1 = this.p1.x;
        this._radius.y1 = this.p1.y;
        this._radius.x2 = this.p2.x;
        this._radius.y2 = this.p2.y;

        // render
        this.clear();

        this._radiusGraphics.strokeLineShape(this._radius);
        this._lineGraphics.strokeLineShape(this._line);
    }
}