import Phaser from 'phaser';

import PsyanimConstants from './PsyanimConstants';
import PsyanimGeomUtils from './utils/PsyanimGeomUtils';

export default class PsyanimEntity extends Phaser.Physics.Matter.Sprite {

    constructor(scene, name, x = 0, y = 0, shapeParams = { isEmpty: true }, matterOptions = {}) {

        /**
         *  Some helpful tips:
         *      - use 'this.visible' to toggle sprite visibility
         *      - use 'this.body.isSleeping' to toggle whether or not this object receives physics updates
         *      - use 'this.body.isSensor' to toggle whether this body collides with other bodies or not
         * 
         *  From: https://github.com/liabru/matter-js/issues/179
         * 
         *  "Internally the engine uses MKS (meters, kilograms, and seconds) units 
         *  and radians for angles.
         * 
         *  If you use the built in renderer and and built in runner, with default 
         *  settings this translates to:
         *  
         *      1 position = 1 px
         *      1 speed = 1 px per step
         *      1 step = 16.666ms"
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

        let geomParams = null;

        switch(shapeType)
        {
            case PsyanimConstants.SHAPE_TYPE.CIRCLE:

                let radius = (shapeParams.radius) ? shapeParams.radius : defaultShapeParams.radius;

                let circleGeomParams = {
                    radius: radius
                };

                geomParams = circleGeomParams;

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

                geomParams = triangleGeomParams;

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

                geomParams = rectangleGeomParams;

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

        this._shapeParams = shapeParams;
        this._matterOptions = matterOptions;

        this._color = color;
        this._geomParams = geomParams;
        this._shapeType = shapeType;
        
        this.name = name;

        // setup new physics body
        this.setBody(matterConfig, matterOptions);

        // there's a bug in phaser where 'label' doesn't get set for non-primitive bodies
        this.body.label = this.name;

        if (Object.hasOwn(shapeParams, 'isEmpty') && shapeParams.isEmpty == true)
        {
            this.visible = false;

            this.body.isSleeping = true;
            this.body.isSensor = true;
        }
        else
        {
            this.visible = Object.hasOwn(shapeParams, 'visible') ? shapeParams.visible : defaultShapeParams.visible;

            this.body.isSensor = matterOptions.isSensor;
            this.body.isSleeping = matterOptions.isSleeping;
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

    get shapeParams() {

        return this._shapeParams;
    }

    get matterOptions() {

        return this._matterOptions;
    }

    get geomParams() {
        return this._geomParams;
    }

    get shapeType() {
        return this._shapeType;
    }

    get color() {
        return this._color;
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

    getComponentsByType(componentType) {

        let components = this._components.filter(c => c instanceof componentType);

        if (components.length == 0)
        {
            return null;
        }

        return components;
    }

    getComponents() {

        return this._components.slice();
    }

    setPhysicsEnabled(enabled) {

        this.body.isSensor = !enabled;
        this.body.isSleeping = !enabled;
    }
    
    destroy() {

        this._components.forEach(c => {
            c.destroy();
        });
        
        this._components = [];

        super.destroy();
    }

    _removeComponent(component) {

        this._components = this._components.filter(c => c != component);
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

        let currentVelocityXY = this.scene.matter.body.getVelocity(this.body);

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