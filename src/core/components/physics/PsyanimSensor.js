import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';
import PsyanimConstants from '../../PsyanimConstants';

export default class PsyanimSensor extends PsyanimComponent {

    constructor(entity) {

        super(entity);

        this.body = null

        this.events = new Phaser.Events.EventEmitter();

        // TODO: add a default body here, but that means you'll have 
        //  unsub from the onCollideCallback() when you setup a new one
    }

    setBody(shapeParams) {

        if (this.body != null)
        {
            this.body.onCollideCallback = null;
        }

        switch (shapeParams.shapeType) 
        {
            case PsyanimConstants.SHAPE_TYPE.CIRCLE:

                this.body = this.entity.scene.matter.add.circle(
                    this.entity.x, this.entity.y,
                    shapeParams.radius,
                    {
                        label: this.entity.name,
                        isSensor: true,
                        collisionFilter: PsyanimConstants.DEFAULT_SENSOR_COLLISION_FILTER,
                        onCollideCallback: (pair) => this._onTriggerEnter(pair),
                        onCollideEndCallback: (pair) => this._onTriggerExit(pair)
                    }
                );

                break;
            
            case PsyanimConstants.SHAPE_TYPE.RECTANGLE:

                break;
        }
    }

    _onTriggerEnter(pair) {

        let bodyA = pair.bodyA;
        let bodyB = pair.bodyB;

        let bodyLabelA = bodyA.label;
        let bodyLabelB = bodyB.label;

        let otherLabel = null;

        if (bodyLabelA != this.entity.name)
        {
            otherLabel = bodyLabelA;
        }
        else if (bodyLabelB == this.entity.name)
        {
            otherLabel = bodyLabelB;
        }

        if (otherLabel != null)
        {
            this.events.emit('triggerEnter', otherLabel);
        }
    }

    _onTriggerExit(pair) {

        let bodyA = pair.bodyA;
        let bodyB = pair.bodyB;

        let bodyLabelA = bodyA.label;
        let bodyLabelB = bodyB.label;

        let otherLabel = null;

        if (bodyLabelA != this.entity.name)
        {
            otherLabel = bodyLabelA;
        }
        else if (bodyLabelB == this.entity.name)
        {
            otherLabel = bodyLabelB;
        }

        if (otherLabel != null)
        {
            this.events.emit('triggerExit', otherLabel);
        }
    }

    update(t, dt) {

        super.update(t, dt);

        // keep bodies in sync with entity
        this.entity.scene.matter.body
            .setPosition(this.body, { x: this.entity.x, y: this.entity.y });
}
}