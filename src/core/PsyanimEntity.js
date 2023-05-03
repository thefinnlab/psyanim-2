import Phaser from 'phaser';

import PsyanimConstants from './PsyanimConstants';
import PsyanimGeomUtils from './PsyanimGeomUtils';
import PsyanimComponent from './PsyanimComponent';

export default class PsyanimEntity extends Phaser.Physics.Matter.Sprite {

    constructor(scene, name, x, y, shapeParams = { isEmpty: false }) {

        /**
         *  Some helpful tips:
         *      - use 'this.visible' to toggle sprite visibility
         *      - use 'this.body.isSleeping' to toggle whether or not this object receives physics updates
         *      - use 'this.body.isSensor' to toggle whether this body collides with other bodies or not
         */

        const defaultShapeParams = {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
            base: 30, altitude: 60, 
            width: 20, height: 20, 
            radius: 4, 
            color: 0xffff00,
        };

        let textureKey = scene.scene.key + "_" + name;

        let matterConfig = {};

        let matterOptions = {
            label: name,
            collisionFilter: {
                category: PsyanimConstants.COLLISION_CATEGORIES.DEFAULT,
                mask: PsyanimConstants.COLLISION_CATEGORIES.DEFAULT | 
                    PsyanimConstants.COLLISION_CATEGORIES.SCREEN_BOUNDARY
            }
        };

        let shapeType = (shapeParams.shapeType) ? shapeParams.shapeType : defaultShapeParams.shapeType;
        let color = (shapeParams.color) ? shapeParams.color : defaultShapeParams.color;

        switch(shapeType)
        {
            case PsyanimConstants.SHAPE_TYPE.CIRCLE:

                let radius = (shapeParams.radius) ? shapeParams.radius : defaultShapeParams.radius;

                let circleGeomParams = {
                    radius: radius
                };

                PsyanimGeomUtils.generateCircleTexture(scene, textureKey, circleGeomParams, color);

                matterConfig.type = 'circle';
                matterConfig.radius = circleGeomParams.radius;

                break;

            case PsyanimConstants.SHAPE_TYPE.TRIANGLE:

                let base = (shapeParams.base) ? shapeParams.base : defaultShapeParams.base;
                let altitude = (shapeParams.altitude) ? shapeParams.altitude : defaultShapeParams.altitude;
    
                let triangleGeomParams = {
                    base: base, altitude: altitude
                };

                PsyanimGeomUtils.generateTriangleTexture(scene, textureKey, triangleGeomParams, color);

                matterConfig.type = 'fromVertices';
                matterConfig.verts = PsyanimGeomUtils.computeTriangleVertices(base, altitude);
    
                break;

            case PsyanimConstants.SHAPE_TYPE.RECTANGLE:

                let width = (shapeParams.width) ? shapeParams.width : defaultShapeParams.width;
                let height = (shapeParams.height) ? shapeParams.height : defaultShapeParams.height;

                let rectangleGeomParams = {
                    width: width, height: height
                };

                PsyanimGeomUtils.generateRectangleTexture(scene, textureKey, rectangleGeomParams, color);

                matterConfig.type = 'rectangle';
                matterConfig.width = width;
                matterConfig.height = height;

                break;
        }

        super(scene.matter.world, x, y, textureKey);

        this.name = name;

        this.setBody(matterConfig, matterOptions);

        if (shapeParams.isEmpty)
        {
            this.body.isSleeping = true;
            this.body.isSensor = true;
            this.visible = false;
        }

        let mass = 100;

        this.body.mass = mass;
        this.body.inverseMass = 1/mass;

        this.body.inertia = Infinity;
        this.body.inverseInertia = 0;

        scene.add.existing(this);

        /**
         *  Private fields
         */

        this._components = [];
    }

    addComponent(componentType) {

        // TODO: let's make sure we don't add multiple entities of this component type

        let newComponent = new componentType(this);

        this._components.push(newComponent);

        return newComponent;
    }

    getComponent(componentType) {

        let components = this._components.filter(c => c instanceof componentType);

        if (components.length == 0)
        {
            return null;
        }

        return components[0];
     }

    get position() {

        return new Phaser.Math.Vector2(this.x, this.y);
    }

    get forward() {

        return new Phaser.Math.Vector2(1, 0).setAngle(this.angle * Math.PI / 180);
    }

    get right() {

        return this.forward.rotate(90 * Math.PI / 180);
    }

    update(t, dt) {

        this._components.forEach(c => c.update(t, dt));
    }
}