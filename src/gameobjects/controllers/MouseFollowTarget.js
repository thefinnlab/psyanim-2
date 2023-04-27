import PsyanimConstants from "../PsyanimConstants";
import PsyanimGeomUtils from "../PsyanimGeomUtils";

export default class MouseFollowTarget extends Phaser.Physics.Matter.Sprite {

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

        this.scene.events.on('update', (t, dt) => { this.update(t, dt) });
    }

    update(t, dt) {

        this.x = this.scene.input.x;
        this.y = this.scene.input.y;
    }
}