import Phaser from 'phaser';

import PsyanimConstants from '../gameobjects/PsyanimConstants';

export default class PsyanimScreenBoundary {

    constructor(scene, x = 400, y = 300, width = 800, height = 600) {

        this.scene = scene;

        this.body = scene.matter.add.rectangle(x, y, width, height, {
            label: 'screen_boundary',
            isStatic: true,
            isSensor: true,
            collisionFilter: {
                category: PsyanimConstants.COLLISION_CATEGORIES.SCREEN_BOUNDARY,
                mask: PsyanimConstants.COLLISION_CATEGORIES.DEFAULT
            },
            onCollideEndCallback: (pair) => this._handleCollisionEnd(pair)
        });

        this.lowerYBound = y + height / 2;
        this.upperYBound = y - height / 2;
        this.leftXBound = x - width / 2;
        this.rightXBound = x + width/2;
    }

    _handleCollisionEnd(pair) {

        let body = null;

        if (pair.bodyA !== this.body) {
            body = pair.bodyA;
        }
        else {
            body = pair.bodyB;
        }

        if (body.position.y > this.lowerYBound)
        {
            // body passed the lower-Y boundary
            let delta = body.position.y - this.lowerYBound;

            this.scene.matter.body.setPosition(body, {x: body.position.x, y: this.upperYBound + delta});
        }

        if (body.position.y < this.upperYBound)
        {
            // body passed the upper-Y boundary
            let delta = this.upperYBound - body.position.y;

            this.scene.matter.body.setPosition(body, {x: body.position.x, y: this.lowerYBound - delta});
        }

        if (body.position.x > this.rightXBound)
        {
            // body passed the right-X boundary
            let delta = body.position.x - this.rightXBound;

            this.scene.matter.body.setPosition(body, {x: this.leftXBound + delta, y: body.position.y});
        }

        if (body.position.x < this.leftXBound)
        {
            // body passed the left-X boundary
            let delta = this.leftXBound - body.position.x;

            this.scene.matter.body.setPosition(body, {x: this.rightXBound - delta, y: body.position.y});
        }
    }
}