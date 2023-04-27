import Phaser from 'phaser';

import PsyanimConstants from "../PsyanimConstants";

export default class PsyanimVehicle extends Phaser.Physics.Matter.Sprite {

    constructor(scene, x, y, texture) {

        super(scene, x, y, texture, null, {
            collisionFilter: {
                category: PsyanimConstants.COLLISION_CATEGORIES.DEFAULT,
                mask: PsyanimConstants.COLLISION_CATEGORIES.DEFAULT | 
                    PsyanimConstants.COLLISION_CATEGORIES.SCREEN_BOUNDARY
            }
        });

        // TODO: depending on the texture chosen, we need to setup the proper collider
    }

    update() {

    }
}