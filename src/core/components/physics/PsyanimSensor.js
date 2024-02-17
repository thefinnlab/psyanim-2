import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent.js';
import PsyanimConstants from '../../PsyanimConstants.js';
import PsyanimEntity from '../../PsyanimEntity.js';

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

        this._psyanimSensorId = this.scene.getNewPsyanimSensorId();

        this._intersectingEntities = [];

        this._handleEntityDestroyedCallback = this._handleEntityDestroyed.bind(this);

        this._handleEntityAddedToSceneCallback = this._handleEntityAddedToScene.bind(this);
    }

    isIntersecting(entity) {

        if (this._intersectingEntities.find(e => e.psyanimSensorId === entity.psyanimSensorId))
        {
            return true;
        }

        return false;
    }

    get sensorBody() {

        return this._sensorBody;
    }

    scale(factor) {

        this.entity.scene.matter.body.scale(this._sensorBody, factor, factor);
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
                        isSensor: true,
                        collisionFilter: PsyanimConstants.DEFAULT_SENSOR_COLLISION_FILTER,
                        onCollideCallback: (pair) => this._onTriggerEnter(pair),
                        onCollideEndCallback: (pair) => this._onTriggerExit(pair)
                    }
                );

                break;
            
            case PsyanimConstants.SHAPE_TYPE.RECTANGLE:

                this._sensorBody = this.entity.scene.matter.add.rectangle(
                    this.entity.x, this.entity.y,
                    shapeParams.width, shapeParams.height,
                    {
                        isSensor: true,
                        collisionFilter: PsyanimConstants.DEFAULT_SENSOR_COLLISION_FILTER,
                        onCollideCallback: (pair) => this._onTriggerEnter(pair),
                        onCollideEndCallback: (pair) => this._onTriggerExit(pair)
                    }
                );
                break;
        }
    }

    _handleEntityAddedToScene(gameObject, scene) {

        gameObject.on(Phaser.GameObjects.Events.DESTROY, this._handleEntityDestroyedCallback);
    }

    _handleEntityDestroyed(entity) {

        this._intersectingEntities = this._intersectingEntities
            .filter(e => e.psyanimSensorId !== entity.psyanimSensorId);

        entity.off(Phaser.GameObjects.Events.DESTROY, this._handleEntityDestroyedCallback);
    }

    afterCreate() {

        super.afterCreate();

        this.setBody(this.bodyShapeParams);

        this.scene.events.on(Phaser.Scenes.Events.ADDED_TO_SCENE, this._handleEntityAddedToSceneCallback);
    }

    destroy() {

        this.scene.events.off(Phaser.Scenes.Events.ADDED_TO_SCENE, this._handleEntityAddedToSceneCallback);

        super.destroy();
    }

    onEnable() {

        this._sensorBody.isSleeping = false;
    }

    onDisable() {

        this._sensorBody.isSleeping = true;
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

        if (body != null && body.gameObject != null)
        {
            if (body.gameObject instanceof PsyanimEntity)
            {
                this.events.emit('triggerEnter', body.gameObject);

                // sometimes, body.gameObject can become 'null' after firing 'triggerEnter'
                // e.g. if one of the listening objects decides to destroy the gameobject
                if (body.gameObject)
                {
                    this._intersectingEntities.push(body.gameObject);
                }
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

                // sometimes, body.gameObject can become 'null' after firing 'triggerExit'
                // e.g. if one of the listening objects decides to destroy the gameobject
                if (body.gameObject)
                {
                    this._intersectingEntities = this._intersectingEntities
                        .filter(e => e.psyanimSensorId !== body.gameObject.psyanimSensorId);
                }
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