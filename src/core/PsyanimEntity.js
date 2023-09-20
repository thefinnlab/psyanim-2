import Phaser from 'phaser';

import PsyanimConstants from './PsyanimConstants';
import PsyanimGeomUtils from './utils/PsyanimGeomUtils';

import PsyanimApp from './PsyanimApp';

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
export default class PsyanimEntity extends Phaser.Physics.Matter.Sprite {

    constructor(scene, name, x = 0, y = 0, shapeParams = { isEmpty: true }, matterOptions = {}) {

        // before we call super(), let's generate the necessary textures and matter config
        let textureKey = null;

        if (shapeParams.textureKey) 
        {
            textureKey = shapeParams.textureKey;
        }
        else
        {
            textureKey = PsyanimApp.Instance.currentSceneKey + "_" + name;
        }

        const defaultShapeParams = PsyanimConstants.DEFAULT_ENTITY_SHAPE_PARAMS;

        let shapeType = Object.hasOwn(shapeParams, 'shapeType') ? shapeParams.shapeType : defaultShapeParams.shapeType;
        let color = Object.hasOwn(shapeParams, 'color') ? shapeParams.color : defaultShapeParams.color;

        let geomParams = null;
        let matterConfig = { type: 'circle', radius: 1 };

        let isEmpty = Object.hasOwn(shapeParams, 'isEmpty') ? shapeParams.isEmpty : false;

        if (isEmpty)
        {
            textureKey = '';
        }
        else
        {
            let generateNewTexture = false;

            if ( !scene.textures.exists(textureKey) )
            {
                generateNewTexture = true;
            }    

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
        }

        // initialize Phaser.Physics.Matter.Sprite
        super(scene.matter.world, x, y, textureKey);

        // save off this entity's properties
        this._shapeParams = shapeParams;
        this._matterOptions = matterOptions;

        this._color = color;
        this._geomParams = geomParams;
        this._shapeType = shapeType;
        
        this.name = name;

        // setup new physics body
        matterOptions.name = Object.hasOwn(matterOptions, 'name') ? matterOptions.name : name;
        matterOptions.isSensor = Object.hasOwn(matterOptions, 'isSensor') ? matterOptions.isSensor : false;
        matterOptions.isSleeping = Object.hasOwn(matterOptions, 'isSleeping') ? matterOptions.isSleeping : false;
        matterOptions.collisionFilter = Object.hasOwn(matterOptions, 'collisionFilter') 
            ? matterOptions.collisionFilter : PsyanimConstants.DEFAULT_SPRITE_COLLISION_FILTER;
        
        this.setBody(matterConfig, matterOptions);

        // there's a bug in phaser where 'label' doesn't get set for non-primitive bodies
        this.body.label = this.name;

        // setup visibility and isSensor / isSleeping depending on whether this object is empty
        this.body.isSleeping = matterOptions.isSleeping;

        if (isEmpty)
        {
            this.visible = false;

            this.body.isSensor = true;
        }
        else
        {
            this.visible = Object.hasOwn(shapeParams, 'visible') ? shapeParams.visible : defaultShapeParams.visible;

            this.body.isSensor = matterOptions.isSensor;
        }

        if (Object.hasOwn(shapeParams, 'depth'))
        {
            this.depth = shapeParams.depth;
        }

        let mass = 100;

        this.body.mass = mass;
        this.body.inverseMass = 1/mass;

        this.body.inertia = Infinity;
        this.body.inverseInertia = 0;

        // we add the entity to the scene in constructor to guarantee all entities always live in a scene
        scene.add.existing(this);

        // setup private fields
        this._components = [];
    }

    /**
     *  Parameters defining the shape of the entity.
     * 
     *  If `isEmpty` is `true`, this entity will not have a visual representation.
     * 
     *  If `isEmpty` is false, it will have a visual representation defined by the following parameters:
     * 
     *  - `shapeType`: `PsyanimConstants.SHAPE_TYPE`
     * 
     *  If `shapeType` is `PsyanimConstants.SHAPE_TYPE.CIRCLE`, `radius` parameter controls its size.
     * 
     *  If `shapeType` is `PsyanimConstants.SHAPE_TYPE.RECTANGLE`, `width` and `height` parameters control its size.
     *  
     *  If `shapeType` is `PsyanimConstants.SHAPE_TYPE.TRIANGLE`, `base` and `altitude` parameters control its size.
     *
     *  - `color`: `Number` representing RGB color
     *  - `visible`: `boolean`
     * 
     *  @type {Object}
     */
    get shapeParams() {

        return this._shapeParams;
    }

    /**
     *  Parameters defining the physics settings of the entity:
     * 
     *  - `isSensor`: `boolean`
     * 
     *  If `isSensor` is `true`, this entity will be able to emit collision events, but will not have 
     *  impulses applied to it or others which collide with it.
     * 
     *  - `isSleeping`: `boolean`
     * 
     *  If `isSleeping` is `true`, this entity will not have physics updates applied to it at all.
     *  Physics will be completely disabled for this entity.
     * 
     *  - `collisionFilter`: `Object`
     * 
     *  `collisionFilter` is a matter-js collision filter.  Default is `PsyanimConstants.DEFAULT_SPRITE_COLLISION_FILTER`
     * 
     *  @type {Object}
     */
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

    enableFriction(friction = 0.1, frictionAir = 0.01, frictionStatic = 0.5) {

        this.body.friction = friction;
        this.body.frictionAir = frictionAir;
        this.body.frictionStatic = frictionStatic;
    }

    disableFriction() {

        this.body.friction = 0;
        this.body.frictionAir = 0;
        this.body.frictionStatic = 0;
    }

    addComponent(componentType) {

        if (this.getComponent(componentType) != null)
        {
            PsyanimDebug.error("Attempting to add the same component type, '" + componentType.constructor.name +
                "' more than once to entity '" + this.name + "'!");

            return null;
        }

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

    getComponentByIndex(index) {

        return this._components[index];
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

    afterCreate() {

        this._components.forEach(c => {

            c.afterCreate();
        })
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