import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';
import PsyanimConstants from '../../PsyanimConstants';
import PsyanimEntity from '../../PsyanimEntity';

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

        let body = null;

        if (bodyA != this.entity.body)
        {
            body = bodyA;
        }
        else if (bodyB != this.entity.body)
        {
            body = bodyB;
        }

        if (body != null)
        {
            if (body.gameObject instanceof PsyanimEntity)
            {
                this.events.emit('triggerEnter', body.gameObject);
            }
            else
            {
                console.warn('Sensor detected entity which is not in scene: ' + body.label);
            }
        }
        else
        {
            console.warn('Sensor::onTriggerEnter detected a collision pair that has nothing to do with this entity.');
        }
    }

    _onTriggerExit(pair) {

        let bodyA = pair.bodyA;
        let bodyB = pair.bodyB;

        let body = null;

        if (bodyA != this.entity.body)
        {
            body = bodyA;
        }
        else if (bodyB != this.entity.body)
        {
            body = bodyB;
        }

        if (body != null)
        {
            if (body.gameObject instanceof PsyanimEntity)
            {
                this.events.emit('triggerExit', body.gameObject);
            }
            else
            {
                console.warn('Sensor detected entity which is not in scene: ' + body.label);
            }
        }
        else
        {
            console.warn('Sensor::onTriggerExit detected a collision pair that has nothing to do with this entity.');
        }
    }

    update(t, dt) {

        super.update(t, dt);

        // keep bodies in sync with entity
        this.entity.scene.matter.body
            .setPosition(this.sensorBody, { x: this.entity.x, y: this.entity.y });
    }
}