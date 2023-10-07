import PsyanimComponent from '../../PsyanimComponent.js';

import PsyanimDebug from '../../utils/PsyanimDebug.js';

export default class PsyanimMimic extends PsyanimComponent {

    /**
     *  Target entity to mimic.
     *  @type {PsyanimEntity}
     */
    target;

    /**
     *  Amount by which to offset the *local* x-coordinate of this mimic's displacements from the target's.
     *  @type {Number}
     */
    xOffset;

    /**
     *  Amount by which to offset the *local* y-coordinate of this mimic's displacements from the target's.
     *  @type {Number}
     */
    yOffset;

    /**
     *  Angle, in degrees, by which to rotate all of the target's displacements before applying them
     *  to this entity.
     *  @type {Number}
     */
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