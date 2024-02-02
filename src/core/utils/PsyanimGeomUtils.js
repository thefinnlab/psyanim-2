import PsyanimConstants from "../PsyanimConstants.js";

export default class PsyanimGeomUtils {

    /**
     *  NOTE: when generating a texture from any kind of Phaser graphics object, it's critical to place it at the center of 
     *  your viewport if you want the associated texture to be centered and not clipped.
     */

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
     * @param {*} geomParams
     * @param {*} color 
     */
    static generateTriangleTexture(scene, textureKey, geomParams = { base: 12, altitude: 24}, color = 0x0000ff) {

        let verts = PsyanimGeomUtils.computeTriangleVertices(geomParams.base, geomParams.altitude);

        // let verts = [
        //     { x: 0, y: 0 },
        //     { x: geomParams.altitude, y: geomParams.base / 2 },
        //     { x: 0, y: geomParams.base }
        // ];

        let textureWidth = geomParams.altitude;
        let textureHeight = geomParams.base;

        let translatedVerts = [
            { x: verts[0].x + (1/3) * geomParams.altitude, y: verts[0].y + (1/2) * geomParams.base },
            { x: verts[1].x + (1/3) * geomParams.altitude, y: verts[1].y + (1/2) * geomParams.base },
            { x: verts[2].x + (1/3) * geomParams.altitude, y: verts[2].y + (1/2) * geomParams.base }
        ]

        let graphics = scene.add.graphics();
        graphics.fillStyle(color);

        // graphics.fillTriangle(
        //     verts[0].x, verts[0].y,
        //     verts[1].x, verts[1].y,
        //     verts[2].x, verts[2].y,
        // );

        graphics.fillTriangle(
            translatedVerts[0].x, translatedVerts[0].y,
            translatedVerts[1].x, translatedVerts[1].y,
            translatedVerts[2].x, translatedVerts[2].y);

        graphics.generateTexture(textureKey, textureWidth, textureHeight);
        graphics.destroy();
    }

    /**
     * 
     * @param {*} scene 
     * @param {*} textureKey 
     * @param {*} geomParams
     * @param {*} color 
     */
    static generateCircleTexture(scene, textureKey, geomParams = { radius: 12 }, color = 0xffff00) {

        let viewportWidth = scene.game.config.width;
        let viewportHeight = scene.game.config.height;

        let viewportCenter = { x: viewportWidth / 2, y: viewportHeight / 2 };

        let graphics = scene.add.graphics();
        graphics.fillStyle(color);
        graphics.fillCircle(viewportCenter.x, viewportCenter.y, geomParams.radius);
        graphics.generateTexture(textureKey);
        graphics.destroy();
    }

    static generateRectangleTexture(scene, textureKey, geomParams = { width: 60, height: 30 }, color = 0xffff00) {

        let viewportWidth = scene.game.config.width;
        let viewportHeight = scene.game.config.height;

        let viewportCenter = { x: viewportWidth / 2, y: viewportHeight / 2 };

        let graphics = scene.add.graphics();
        graphics.fillStyle(color);

        graphics.fillRect(
            viewportCenter.x - geomParams.width / 2, 
            viewportCenter.y - geomParams.height / 2, 
            geomParams.width, 
            geomParams.height);

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