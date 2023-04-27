
export default class PsyanimConstants {

    static COLLISION_CATEGORIES = {
        NONE: 0x0000,
        DEFAULT: 0x0001,
        MOUSE_CURSOR: 0x0002,
        SCREEN_BOUNDARY: 0x0004
    }

    static DEFAULT_SPRITE_COLLISION_FILTER = {
        category: PsyanimConstants.COLLISION_CATEGORIES.DEFAULT,
        mask: PsyanimConstants.COLLISION_CATEGORIES.DEFAULT | 
            PsyanimConstants.COLLISION_CATEGORIES.SCREEN_BOUNDARY
    };
}