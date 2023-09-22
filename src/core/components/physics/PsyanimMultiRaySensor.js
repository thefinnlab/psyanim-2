import Phaser from 'phaser';
import PsyanimComponent from "../../PsyanimComponent";

class PsyanimEntityRay {

    id;

    distance;
    relativeAngle;

    constructor(entity, id, distance = 150, relativeAngle = 0) {

        this.entity = entity;
        this.id = id;

        this.distance = distance;
        this.relativeAngle = relativeAngle;

        this._startPoint = new Phaser.Math.Vector2.ZERO.clone();
        this._endPoint = new Phaser.Math.Vector2.ZERO.clone();

        this._isTriggered = false;
    }

    get isTriggered() {
        return this._isTriggered;
    }

    set isTriggered(value) {

        this._isTriggered = value;
    }

    get startPoint() {

        return this._startPoint;
    }

    get endPoint() {

        return this._endPoint;
    }

    updateRayEndpoints() {

        this._startPoint = this.entity.position;

        this._endPoint = new Phaser.Math.Vector2(this.distance, 0)
            .setAngle((this.entity.angle + this.relativeAngle) * Math.PI / 180.0)
            .add(this._startPoint);
    }
}

export default class PsyanimMultiRaySensor extends PsyanimComponent {

    rayInfoList;

    bodyNames;

    detectScreenBoundaries;

    constructor(entity) {

        super(entity);

        this.detectScreenBoundaries = true;

        this.bodyNames = [];

        this._bodyList = [];

        this._entitiesInSight = [];

        this._rayMap = new Map();
    }

    get rayMap() {

        return this._rayMap;
    }

    get isTriggered() {

        return this._entitiesInSight.length > 0;
    }

    get entitiesInSight() {

        return this._entitiesInSight;
    }

    afterCreate() {

        super.afterCreate();

        // construct rays from info list
        this.rayInfoList.forEach(rayInfo => {

            let ray = new PsyanimEntityRay(this.entity, rayInfo.id,
                rayInfo.distance, rayInfo.relativeAngle);

            this._rayMap.set(rayInfo.id, ray);

            ray.updateRayEndpoints();
        });

        // optionally add screen boundaries to our body list
        if (this.detectScreenBoundaries)
        {
            let screenBoundaryBodies = this.scene.screenBoundary.boundaries
                .map(boundary => boundary.body);

            this._bodyList.push(...screenBoundaryBodies);
        }

        this.bodyNames.forEach(bodyName => {

            this._bodyList.push(this.scene.getEntityByName(bodyName).body);
        });
    }

    _castRays() {

        this._entitiesInSight = [];

        this._rayMap.forEach(ray => {

            let collisions = this.scene.matter.query.ray(
                this._bodyList, ray.startPoint, ray.endPoint);

            ray.isTriggered = collisions && collisions.length != 0;

            if (ray.isTriggered)
            {
                for (let i = 0; i < collisions.length; ++i)
                {
                    let collision = collisions[i];
    
                    if (!this._entitiesInSight.includes(collision.body.gameObject))
                    {
                        this._entitiesInSight.push(collision.body.gameObject);
                    }
                }
            }
        });
    }

    update(t, dt) {

        super.update(t, dt);

        this._rayMap.forEach(ray => ray.updateRayEndpoints());

        this._castRays();
    }
}