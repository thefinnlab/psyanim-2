import Phaser from 'phaser';

import PsyanimConstants from './PsyanimConstants';
import PsyanimGeomUtils from './PsyanimGeomUtils';
import PsyanimComponent from './PsyanimComponent';

export default class PsyanimEntity extends Phaser.Physics.Matter.Sprite {

    constructor(scene, name, x, y, shapeParams = { isEmpty: false }, matterOptions = {}) {

        /**
         *  Some helpful tips:
         *      - use 'this.visible' to toggle sprite visibility
         *      - use 'this.body.isSleeping' to toggle whether or not this object receives physics updates
         *      - use 'this.body.isSensor' to toggle whether this body collides with other bodies or not
         */

        // TODO: everywhere you're doing these checks for object properties, use Object.hasOwn()!!!
        // otherwise, bools and ints may get evaluated unexpectedly!

        // setup rendering
        const defaultShapeParams = {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
            base: 30, altitude: 60, 
            width: 20, height: 20, 
            radius: 4, 
            color: 0xffff00,
            visible: true
        };

        let textureKey = null;
        let generateNewTexture = false;

        if (shapeParams.textureKey) 
        {
            textureKey = shapeParams.textureKey;
        }
        else
        {
            textureKey = scene.scene.key + "_" + name;
        }

        // if textureKey doesn't exist in texture manager,
        if ( !scene.textures.exists(textureKey) )
        {
            generateNewTexture = true;
        }
        
        let matterConfig = {};

        matterOptions.name = Object.hasOwn(matterOptions, 'name') ? matterOptions.name : name;
        matterOptions.isSensor = (matterOptions.isSensor) ? matterOptions.isSensor : false;
        matterOptions.isSleeping = (matterOptions.isSleeping) ? matterOptions.isSleeping : false;
        matterOptions.collisionFilter = Object.hasOwn(matterOptions, 'collisionFilter') 
            ? matterOptions.collisionFilter : PsyanimConstants.DEFAULT_SPRITE_COLLISION_FILTER;

        let shapeType = (shapeParams.shapeType) ? shapeParams.shapeType : defaultShapeParams.shapeType;
        let color = (shapeParams.color) ? shapeParams.color : defaultShapeParams.color;

        switch(shapeType)
        {
            case PsyanimConstants.SHAPE_TYPE.CIRCLE:

                let radius = (shapeParams.radius) ? shapeParams.radius : defaultShapeParams.radius;

                let circleGeomParams = {
                    radius: radius
                };

                if (generateNewTexture)
                {
                    PsyanimGeomUtils.generateCircleTexture(scene, textureKey, circleGeomParams, color);
                }

                matterConfig.type = 'circle';
                matterConfig.radius = circleGeomParams.radius;

                break;

            case PsyanimConstants.SHAPE_TYPE.TRIANGLE:

                let base = (shapeParams.base) ? shapeParams.base : defaultShapeParams.base;
                let altitude = (shapeParams.altitude) ? shapeParams.altitude : defaultShapeParams.altitude;
    
                let triangleGeomParams = {
                    base: base, altitude: altitude
                };

                if (generateNewTexture)
                {
                    PsyanimGeomUtils.generateTriangleTexture(scene, textureKey, triangleGeomParams, color);
                }

                matterConfig.type = 'fromVertices';
                matterConfig.verts = PsyanimGeomUtils.computeTriangleVertices(base, altitude);
    
                break;

            case PsyanimConstants.SHAPE_TYPE.RECTANGLE:

                let width = (shapeParams.width) ? shapeParams.width : defaultShapeParams.width;
                let height = (shapeParams.height) ? shapeParams.height : defaultShapeParams.height;

                let rectangleGeomParams = {
                    width: width, height: height
                };

                if (generateNewTexture)
                {
                    PsyanimGeomUtils.generateRectangleTexture(scene, textureKey, rectangleGeomParams, color);
                }

                matterConfig.type = 'rectangle';
                matterConfig.width = width;
                matterConfig.height = height;

                break;
        }

        super(scene.matter.world, x, y, textureKey);

        this.name = name;

        // setup new physics body
        this.setBody(matterConfig, matterOptions);

        // there's a bug in phaser where 'label' doesn't get set for non-primitive bodies
        this.body.label = this.name;

        if (shapeParams.isEmpty)
        {
            this.body.isSleeping = true;
            this.body.isSensor = true;
            this.visible = false;
        }
        else
        {
            this.visible = Object.hasOwn(shapeParams, 'visible') ? shapeParams.visible : defaultShapeParams.visible;
        }

        // TODO: should this be placed in the previous 'else' block above?
        this.body.isSensor = matterOptions.isSensor;
        this.body.isSleeping = matterOptions.isSleeping;

        // console.log(this.name + ' collision filter = ' + JSON.stringify(matterOptions));

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

    set position(value) {

        this.x = value.x;
        this.y = value.y;
    }

    get forward() {

        return new Phaser.Math.Vector2(1, 0).setAngle(this.angle * Math.PI / 180);
    }

    get right() {

        return this.forward.rotate(90 * Math.PI / 180);
    }

    get velocity() {

        let currentVelocityXY = this.getVelocity();

        return new Phaser.Math.Vector2(currentVelocityXY.x, currentVelocityXY.y);
    }

    update(t, dt) {

        this._components.forEach(c => {

            if (c.enabled)
            {
                c.update(t, dt);
            }
        })
    }
}