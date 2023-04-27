import PsyanimConstants from "./PsyanimConstants";

export default class PsyanimGeomUtils {

    static computeTriangleVertices(base, altitude) {

        return [

            {x: -altitude * (1/3), y: -base / 2},
            {x: altitude * (2/3), y: 0 },
            {x: -altitude * (1/3), y: base / 2},
        ];
    }

    /**
     * 
     * @param {*} scene 
     * @param {*} textureKey 
     * @param {*} geomParams - NOTE: x and y must be used to offset texture b.c. anything offscreen isn't kept
     * @param {*} color 
     */
    static generateTriangleTexture(scene, textureKey, geomParams = { x: 400, y: 300, base: 12, altitude: 24}, color = 0x0000ff) {

        let verts = PsyanimGeomUtils.computeTriangleVertices(geomParams.base, geomParams.altitude);

        let graphics = scene.add.graphics();
        graphics.fillStyle(color);
        graphics.fillTriangle(
            verts[0].x + geomParams.x, verts[0].y + geomParams.y,
            verts[1].x + geomParams.x, verts[1].y + geomParams.y,
            verts[2].x + geomParams.x, verts[2].y + geomParams.y
        );
        graphics.generateTexture(textureKey);
        graphics.destroy();
    }

    /**
     * 
     * @param {*} scene 
     * @param {*} textureKey 
     * @param {*} geomParams - NOTE: x and y must be used to offset texture b.c. anything offscreen isn't kept
     * @param {*} color 
     */
    static generateCircleTexture(scene, textureKey, geomParams = { x: 400, y: 300, radius: 12}, color = 0xFFFF00) {

        let graphics = scene.add.graphics();
        graphics.fillStyle(color);
        graphics.fillCircle(geomParams.x, geomParams.y, geomParams.radius);
        graphics.generateTexture(textureKey);
        graphics.destroy();
    }

    static createTriangleSprite(scene, textureKey, 
        geomParams = { x: 400, y: 300, base: 12, altitude: 24 },
        bodyOptions = { collisionFilter: PsyanimConstants.DEFAULT_SPRITE_COLLISION_FILTER }) {

        let verts = PsyanimGeomUtils.computeTriangleVertices(geomParams.base, geomParams.altitude);

        let sprite = scene.matter.add.sprite(geomParams.x, geomParams.y, textureKey, null);

        sprite.setBody({
            type: 'fromVertices',
            verts: verts
        }, bodyOptions);

        return sprite;
    }

    static createCircleSprite(scene, textureKey, 
        geomParams = { x: 400, y: 300, radius: 12 }, 
        bodyOptions = { collisionFilter: PsyanimConstants.DEFAULT_SPRITE_COLLISION_FILTER }) {

        let sprite = scene.matter.add.sprite(geomParams.x, geomParams.y, textureKey);

        sprite.setBody({ 
            type: 'circle', 
            radius: geomParams.radius 
        }, bodyOptions);

        return sprite;
    }
}