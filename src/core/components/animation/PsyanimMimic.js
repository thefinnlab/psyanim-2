import PsyanimComponent from '../../PsyanimComponent.js';

import {
    PsyanimDebug
} from 'psyanim-utils';

/**
 *  `PsyanimMimic` component allows an entity to 'mimic' the behavior of `target` entity.
 * 
 *  For a 'Predator-Prey-Mimic' scene, we should set the prey's 'color' to white so it is invisible on the canvas.  We should also set the 'depth' field of the entity's shapeParams to '0' for the prey, and '1' for the mimic.  This ensures the mimic is always drawn on top of the prey in the canvas., since they can overlap.
 */
export default class PsyanimMimic extends PsyanimComponent {

    /**
     *  Target entity to mimic.
     *  @type {PsyanimEntity}
     */
    target;

    /**
     *  [Range: 0 - 360 ]
     *  [Default: 30 ]
     *  Angle, in degrees, by which to rotate all of the target's displacements before applying them
     *  to this entity.
     *  @type {Number}
     */
    angleOffset;

    constructor(entity) {

        super(entity);

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