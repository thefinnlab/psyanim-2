import PsyanimComponent from '../../PsyanimComponent.js';

import PsyanimConstants from "../../PsyanimConstants.js";

/**
 *  This controller creates a visible target in the scene which follows the mouse cursor.
 */
export default class PsyanimMouseFollowTarget extends PsyanimComponent {

    canCollideWithSprite;

    collisionRadius;

    /**
     * 
     * @param {PsyanimEntity} entity 
     */
    constructor(entity) {

        super(entity);

        this.canCollideWithSprite = false;
        this.collisionRadius = 20;
    }

    afterCreate() {

        super.afterCreate();

        let collisionFilter = {
            category: PsyanimConstants.COLLISION_CATEGORIES.MOUSE_CURSOR,
            mask: PsyanimConstants.COLLISION_CATEGORIES.NONE
        };

        if (this.canCollideWithSprite)
        {
            collisionFilter = PsyanimConstants.DEFAULT_SPRITE_COLLISION_FILTER;
        }

        let bodyOptions = {
            label: '_mouseFollowTarget',
            shape: {
                type: 'circle',
                radius: this.collisionRadius
            },
            collisionFilter: collisionFilter
        }

        this.entity.setBody({ type: 'circle', radius: this.collisionRadius }, bodyOptions);

        // give focus to the canvas so the mouse follow target starts working immediately
        this.entity.scene.game.canvas.focus();
    }

    update(t, dt) {

        super.update(t, dt);

        let x = this.entity.scene.input.x;
        let y = this.entity.scene.input.y;

        if (isFinite(x) && isFinite(y))
        {
            this.entity.x = x;
            this.entity.y = y;    
        }
    }
}