import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

import PsyanimConstants from "../../PsyanimConstants";

export default class PsyanimMouseFollowTarget extends PsyanimComponent {

    constructor(entity, options = { radius: 4 }) {

        super(entity);

        this._radius = options.radius;

        let bodyOptions = {
            label: 'mouseFollowTarget',
            shape: {
                type: 'circle',
                radius: options.radius
            },
            collisionFilter: {
                category: PsyanimConstants.COLLISION_CATEGORIES.MOUSE_CURSOR,
                mask: PsyanimConstants.COLLISION_CATEGORIES.NONE
            }
        }

        this.entity.setBody({ type: 'circle', radius: options.radius }, bodyOptions);
    }

    update(t, dt) {

        super.update(t, dt);

        this.entity.x = this.entity.scene.input.x;
        this.entity.y = this.entity.scene.input.y;
    }
}