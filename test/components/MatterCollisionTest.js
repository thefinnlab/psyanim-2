import PsyanimConstants from "../../src/core/PsyanimConstants.js";

import PsyanimComponent from "../../src/core/PsyanimComponent.js";

export default class MatterCollisionTest extends PsyanimComponent {

    constructor(entity) {

        super(entity);

        this.bodyShapeParams = {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 24
        };

        // TODO: setup custom collision categories that can be shared by player too!
        this._collisionCategory = {};
        this._collisionMask = {};
    }

    afterCreate() {

        super.afterCreate();

        this._sensorBody = this.entity.scene.matter.add.circle(
            this.entity.x, this.entity.y,
            this.bodyShapeParams.radius,
            {
                label: this.entity.name,
                isSensor: true,

                // TODO: setup custom collision filters here
                // collisionFilter: {
                //     category: 
                //     mask: 
                // }
            }
        )
    }

    update(t, dt) {

        super.update(t, dt);

        // keep bodies in sync with entity
        this.entity.scene.matter.body
            .setPosition(this._sensorBody, { x: this.entity.x, y: this.entity.y });

        this.scene.matter.world.on(Phaser.Physics.Matter.Events.COLLISION_START,
            function(event, bodyA, bodyB) {

                console.log('received matter collision event!', bodyA, bodyB);
            });
    }
}