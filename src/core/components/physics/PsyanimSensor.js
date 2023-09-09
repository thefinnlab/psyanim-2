import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';
import PsyanimConstants from '../../PsyanimConstants';
import PsyanimEntity from '../../PsyanimEntity';

export default class PsyanimSensor extends PsyanimComponent {

    bodyShapeParams;

    constructor(entity) {

        super(entity);

        this.events = new Phaser.Events.EventEmitter();

        this._sensorBody = null;

        this.bodyShapeParams = {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 10
        };
    }

    afterCreate() {

        this.setBody(this.bodyShapeParams);
    }

    setBody(shapeParams) {

        this.bodyShapeParams = shapeParams;

        if (this._sensorBody != null)
        {
            this.entity.scene.matter.world.remove(this._sensorBody);

            this._sensorBody = null;
        }

        switch (shapeParams.shapeType) 
        {
            case PsyanimConstants.SHAPE_TYPE.CIRCLE:

                this._sensorBody = this.entity.scene.matter.add.circle(
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

        if (bodyA != this._sensorBody && bodyA != this.entity.body)
        {
            body = bodyA;
        }
        else if (bodyB != this._sensorBody && bodyB != this.entity.body)
        {
            body = bodyB;
        }

        if (body != null)
        {
            if (body.gameObject instanceof PsyanimEntity)
            {
                this.events.emit('triggerEnter', body.gameObject);
            }
        }
    }

    _onTriggerExit(pair) {

        let bodyA = pair.bodyA;
        let bodyB = pair.bodyB;

        let body = null;

        if (bodyA != this._sensorBody && bodyA != this.entity.body)
        {
            body = bodyA;
        }
        else if (bodyB != this._sensorBody && bodyB != this.entity.body)
        {
            body = bodyB;
        }

        if (body != null)
        {
            if (body.gameObject instanceof PsyanimEntity)
            {
                this.events.emit('triggerExit', body.gameObject);
            }
        }
    }

    update(t, dt) {

        super.update(t, dt);

        // keep bodies in sync with entity
        this.entity.scene.matter.body
            .setPosition(this._sensorBody, { x: this.entity.x, y: this.entity.y });
    }
}