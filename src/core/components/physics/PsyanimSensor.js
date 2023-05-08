import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';
import PsyanimConstants from '../../PsyanimConstants';

export default class PsyanimSensor extends PsyanimComponent {

    constructor(entity) {

        super(entity);

        this.sensorBody = null;

        this.events = new Phaser.Events.EventEmitter();

        // TODO: add a default body here, but that means you'll have 
        //  unsub from the onCollideCallback() when you setup a new one
    }

    setBody(shapeParams) {

        if (this.sensorBody != null)
        {
            this.sensorBody.onCollideCallback = null;
        }

        switch (shapeParams.shapeType) 
        {
            case PsyanimConstants.SHAPE_TYPE.CIRCLE:

                this.sensorBody = this.entity.scene.matter.add.circle(
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

    onEnable() {

        this.entity.body.isSleeping = false;
    }

    onDisable() {

        this.entity.body.isSleeping = true;
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
        else if (bodyLabelB != this.entity.name)
        {
            otherLabel = bodyLabelB;
        }

        if (otherLabel != null)
        {
            let entity = this.entity.scene.getEntityByName(otherLabel);

            if (entity)
            {
                this.events.emit('triggerEnter', entity);
            }
            else
            {
                console.warn('Sensor detected entity which is not in scene: ' + otherLabel);
            }
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
        else if (bodyLabelB != this.entity.name)
        {
            otherLabel = bodyLabelB;
        }

        if (otherLabel != null)
        {
            let entity = this.entity.scene.getEntityByName(otherLabel);

            if (entity)
            {
                this.events.emit('triggerExit', entity);
            }
            else
            {
                console.warn('Sensor detected entity which is not in scene: ' + otherLabel);
            }
        }
    }

    update(t, dt) {

        super.update(t, dt);

        // keep bodies in sync with entity
        this.entity.scene.matter.body
            .setPosition(this.sensorBody, { x: this.entity.x, y: this.entity.y });
    }
}