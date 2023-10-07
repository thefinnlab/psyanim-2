export default class PsyanimEntityPrefab {

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
    shapeParams;

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
    matterOptions;

    constructor(shapeParams = { isEmpty: true }, matterOptions = {}) {

        this.shapeParams = shapeParams;
        this.matterOptions = matterOptions;
    }

    create(entity) {

        return entity;
    }
}