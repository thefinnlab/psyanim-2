import Phaser from 'phaser';

export default class PsyanimEntity extends Phaser.Physics.Matter.Sprite {

    constructor(matterWorld, x, y, textureKey, frame = null, options = {}) {

        super(matterWorld, x, y, textureKey, frame, options);

        this._components = [];

        /**
         *  Some helpful tips:
         *      - use 'this.visible' to toggle sprite visibility
         *      - use 'this.body.isSleeping' to toggle whether or not this object receives physics updates
         *      - use 'this.body.isSensor' to toggle whether this body collides with other bodies or not
         */
    }

    addComponent(component) {

        this._components.push(component);
    }

    update(t, dt) {

        this._components.forEach(c => c.update(t, dt));
    }
}