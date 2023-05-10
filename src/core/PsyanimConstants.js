
export default class PsyanimConstants {

    static SHAPE_TYPE = {
        CIRCLE: 'PSYANIM_SHAPE_CIRCLE',
        RECTANGLE: 'PSYANIM_SHAPE_RECTANGLE',
        TRIANGLE: 'PSYANIM_SHAPE_TRIANGLE',
    }

    static COLLISION_CATEGORIES = {
        NONE: 0x0000,
        DEFAULT: 0x0001,
        MOUSE_CURSOR: 0x0002,
        SCREEN_BOUNDARY: 0x0004,
        SENSOR: 0x0008,
        VISUAL_ONLY: 0x0010
    }

    static DEFAULT_SPRITE_COLLISION_FILTER = {
        category: PsyanimConstants.COLLISION_CATEGORIES.DEFAULT,
        mask: PsyanimConstants.COLLISION_CATEGORIES.DEFAULT | 
            PsyanimConstants.COLLISION_CATEGORIES.SENSOR |
            PsyanimConstants.COLLISION_CATEGORIES.SCREEN_BOUNDARY
    };

    static DEFAULT_SENSOR_COLLISION_FILTER = {
        category: PsyanimConstants.COLLISION_CATEGORIES.SENSOR,
        mask: PsyanimConstants.COLLISION_CATEGORIES.DEFAULT
    };

    static DEFAULT_VISUAL_ONLY_COLLISION_FILTER = {
        category: PsyanimConstants.COLLISION_CATEGORIES.VISUAL_ONLY,
        mask: PsyanimConstants.COLLISION_CATEGORIES.NONE
    };

    static DEFAULT_SCREEN_BOUNDARY_COLLISION_FILTER = {
        category: PsyanimConstants.COLLISION_CATEGORIES.SCREEN_BOUNDARY,
        mask: PsyanimConstants.COLLISION_CATEGORIES.DEFAULT
    };
}