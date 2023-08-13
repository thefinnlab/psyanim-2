export default class PsyanimConstants {}

PsyanimConstants.SHAPE_TYPE = {
    CIRCLE: 'PSYANIM_SHAPE_CIRCLE',
    RECTANGLE: 'PSYANIM_SHAPE_RECTANGLE',
    TRIANGLE: 'PSYANIM_SHAPE_TRIANGLE',
};

PsyanimConstants.COLLISION_CATEGORIES = {
    NONE: 0x0000,
    DEFAULT: 0x0001,
    MOUSE_CURSOR: 0x0002,
    SCREEN_BOUNDARY: 0x0004,
    SENSOR: 0x0008,
    VISUAL_ONLY: 0x0010
};

PsyanimConstants.DEFAULT_ENTITY_SHAPE_PARAMS = {
    shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
    base: 30, altitude: 60, 
    width: 20, height: 20, 
    radius: 4, 
    color: 0xffff00,
    visible: true
};

PsyanimConstants.DEFAULT_SPRITE_COLLISION_FILTER = {
    category: PsyanimConstants.COLLISION_CATEGORIES.DEFAULT,
    mask: PsyanimConstants.COLLISION_CATEGORIES.DEFAULT | 
        PsyanimConstants.COLLISION_CATEGORIES.SENSOR |
        PsyanimConstants.COLLISION_CATEGORIES.SCREEN_BOUNDARY
};

PsyanimConstants.DEFAULT_SENSOR_COLLISION_FILTER = {
    category: PsyanimConstants.COLLISION_CATEGORIES.SENSOR,
    mask: PsyanimConstants.COLLISION_CATEGORIES.DEFAULT
};

PsyanimConstants.DEFAULT_VISUAL_ONLY_COLLISION_FILTER = {
    category: PsyanimConstants.COLLISION_CATEGORIES.VISUAL_ONLY,
    mask: PsyanimConstants.COLLISION_CATEGORIES.NONE
};

PsyanimConstants.DEFAULT_SCREEN_BOUNDARY_COLLISION_FILTER = {
    category: PsyanimConstants.COLLISION_CATEGORIES.SCREEN_BOUNDARY,
    mask: PsyanimConstants.COLLISION_CATEGORIES.DEFAULT
};