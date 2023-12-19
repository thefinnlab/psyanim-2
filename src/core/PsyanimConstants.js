export default class PsyanimConstants {}

/**
 * PsyanimConstants.SHAPE_TYPE provides valid values for PsyanimEntity `shapeType` field of the `shapeParams` object.
 */
PsyanimConstants.SHAPE_TYPE = {
    CIRCLE: 'PSYANIM_SHAPE_CIRCLE',
    RECTANGLE: 'PSYANIM_SHAPE_RECTANGLE',
    TRIANGLE: 'PSYANIM_SHAPE_TRIANGLE',
};

/**
 * These are the collision categories used by Psyanim-2 in phaser.
 */
PsyanimConstants.COLLISION_CATEGORIES = {
    NONE: 0x0000,
    DEFAULT: 0x0001,
    MOUSE_CURSOR: 0x0002,
    SCREEN_BOUNDARY: 0x0004,
    SENSOR: 0x0008,
    VISUAL_ONLY: 0x0010
};

/**
 * This is a default entity shape params object that can be used for quickly testing and as a reference.
 */
PsyanimConstants.DEFAULT_ENTITY_SHAPE_PARAMS = {
    shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
    base: 30, altitude: 60, 
    width: 20, height: 20, 
    radius: 4, 
    color: 0xffff00,
    visible: true
};

/**
 * This is the default sprite collision filter used by Psyanim-2 for matter-js in phaser.
 */
PsyanimConstants.DEFAULT_SPRITE_COLLISION_FILTER = {
    category: PsyanimConstants.COLLISION_CATEGORIES.DEFAULT,
    mask: PsyanimConstants.COLLISION_CATEGORIES.DEFAULT | 
        PsyanimConstants.COLLISION_CATEGORIES.SENSOR |
        PsyanimConstants.COLLISION_CATEGORIES.SCREEN_BOUNDARY
};

/**
 * This is the default sensor collision filter used by Psyanim-2 for matter-js in phaser.
 */
PsyanimConstants.DEFAULT_SENSOR_COLLISION_FILTER = {
    category: PsyanimConstants.COLLISION_CATEGORIES.SENSOR,
    mask: PsyanimConstants.COLLISION_CATEGORIES.DEFAULT
};

/**
 * This is the default matter-js collision filter for objects that have a visual representation 
 * but do not interact with other objects in Psyanim-2.
 */
PsyanimConstants.DEFAULT_VISUAL_ONLY_COLLISION_FILTER = {
    category: PsyanimConstants.COLLISION_CATEGORIES.VISUAL_ONLY,
    mask: PsyanimConstants.COLLISION_CATEGORIES.NONE
};

/**
 * This is the default collision filter for the screen boundaries in psyanim-2.
 */
PsyanimConstants.DEFAULT_SCREEN_BOUNDARY_COLLISION_FILTER = {
    category: PsyanimConstants.COLLISION_CATEGORIES.SCREEN_BOUNDARY,
    mask: PsyanimConstants.COLLISION_CATEGORIES.DEFAULT
};