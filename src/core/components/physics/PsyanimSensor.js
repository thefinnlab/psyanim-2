import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent.js';
import PsyanimConstants from '../../PsyanimConstants.js';

export default class PsyanimSensor extends PsyanimComponent {

    debug;
    bodyShapeParams;

    collisionMask;

    constructor(entity) {

        super(entity);

        this.events = new Phaser.Events.EventEmitter();

        this.debug = false;

        this.bodyShapeParams = {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 10
        };

        this.collisionMask = PsyanimConstants.DEFAULT_SENSOR_COLLISION_FILTER.mask;

        this._debugGraphics = this.entity.scene.add.graphics(
            { 
                lineStyle: { 
                    width: 2, color: 0x00ff00, alpha: 0.6 
                },
            });

        this._intersectingEntities = [];
    }

    afterCreate() {

        this._debugGraphics.clear();

        this._debugCircle = new Phaser.Geom.Circle(
            this.entity.x,
            this.entity.y,
            this.bodyShapeParams.radius);

        this._entities = this.scene.entities;

        // assign an ID to each entity so we can do quick comparisons w/o checking names
        for (let i = 0; i < this._entities.length; ++i)
        {
            this._entities[i].psyanimSensorId = i;
        }

        // TODO: in the event that entities are added to a scene at runtime, not just during init,
        // we need to update PsyanimScene to throw events when entities are added & removed
        // and update our entity list here...
    }

    onEnable() {

        super.onEnable();
    }

    onDisable() {

        super.onDisable();
    }

    isIntersecting(entity) {

        if (this._intersectingEntities.find(e => e.psyanimSensorId === entity.psyanimSensorId))
        {
            return true;
        }

        return false;
    }

    _testCircleCircleIntersection(entity) {

        let otherRadius = entity.shapeParams.radius;

        let distanceToEntity = entity.position
            .subtract(this.entity.position)
            .length();

        if (distanceToEntity <= otherRadius + this.bodyShapeParams.radius)
        {
            return true;
        }

        return false;
    }

    _updateEntityIntersectionList(entity, isIntersecting) {

        let entityInList = this._intersectingEntities.find(e => e.psyanimSensorId === entity.psyanimSensorId);

        if (entityInList)
        {
            if (!isIntersecting)
            {
                this.events.emit('triggerExit', entity);
                this._intersectingEntities = this._intersectingEntities
                    .filter(e => e.psyanimSensorId !== entity.psyanimSensorId);
            }
        }
        else
        {
            if (isIntersecting)
            {
                this.events.emit('triggerEnter', entity);
                this._intersectingEntities.push(entity);
            }
        }
    }

    _testIntersections() {

        for (let i = 0; i < this._entities.length; ++i)
        {
            let entity = this._entities[i];

            if (this.collisionMask & entity.matterOptions.collisionFilter.category)
            {
                if (this.bodyShapeParams.shapeType === PsyanimConstants.SHAPE_TYPE.CIRCLE)
                {
                    if (entity.shapeParams.shapeType === PsyanimConstants.SHAPE_TYPE.CIRCLE)
                    {
                        let isIntersecting = this._testCircleCircleIntersection(entity);
    
                        this._updateEntityIntersectionList(entity, isIntersecting);
                    }                
                }    
            }
        }
    }

    update(t, dt) {

        super.update(t, dt);

        if (this.debug)
        {
            this._debugCircle.setPosition(
                this.entity.x,
                this.entity.y
            );

            this._debugGraphics.clear();

            this._debugGraphics.strokeCircleShape(this._debugCircle);
        }

        this._testIntersections();
    }
}