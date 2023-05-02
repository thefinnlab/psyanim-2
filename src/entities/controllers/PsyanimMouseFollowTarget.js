import Phaser from 'phaser';

import PsyanimEntity from '../PsyanimEntity';

import PsyanimConstants from "../PsyanimConstants";
import PsyanimGeomUtils from "../PsyanimGeomUtils";

export default class PsyanimMouseFollowTarget extends PsyanimEntity {

    constructor(scene, x = 400, y = 300, radius = 4) {

        let textureKey = 'mouseFollowTarget';

        PsyanimGeomUtils.generateCircleTexture(scene, textureKey, { x: x, y: y, radius: radius }, 0x00ff00);

        let bodyOptions = {
            label: 'mouseFollowTarget',
            shape: {
                type: 'circle',
                radius: radius
            },
            collisionFilter: {
                category: PsyanimConstants.COLLISION_CATEGORIES.MOUSE_CURSOR,
                mask: PsyanimConstants.COLLISION_CATEGORIES.NONE
            }
        }

        super(scene.matter.world, x, y, textureKey, null, bodyOptions);

        scene.add.existing(this);
    }

    update(t, dt) {

        this.x = this.scene.input.x;
        this.y = this.scene.input.y;
    }
}