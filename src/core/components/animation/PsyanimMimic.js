import PsyanimComponent from '../../PsyanimComponent';

import PsyanimDebug from '../../utils/PsyanimDebug';

export default class PsyanimMimic extends PsyanimComponent {

    target;

    xOffset;
    yOffset;

    angleOffset;

    constructor(entity) {

        super(entity);

        this.xOffset = 0;
        this.yOffset = 0;

        this.angleOffset = 0;

        this._targetCurrentPosition = null;
        this._targetPreviousPosition = null;
    }

    afterCreate() {

        super.afterCreate();

        if (this.target == null)
        {
            PsyanimDebug.error("PsyanimMimic 'target' is null!");
        }

        this._targetCurrentPosition = this.target.position;
        this._targetPreviousPosition = this.target.position;

        this.entity.position = this.target.position
            .add(new Phaser.Math.Vector2(
                this.xOffset, this.yOffset));
    }

    _computeDisplacement() {

        let displacement = this._targetCurrentPosition.clone()
            .subtract(this._targetPreviousPosition);

        displacement.rotate(this.angleOffset * Math.PI / 180.0);

        return displacement;
    }

    update(t, dt) {

        super.update(t, dt);

        this._targetPreviousPosition = this._targetCurrentPosition;

        this._targetCurrentPosition = this.target.position;

        let displacement = this._computeDisplacement();

        this.entity.position = this.entity.position
            .add(displacement);

        this.entity.angle = this.target.angle;
    }
}