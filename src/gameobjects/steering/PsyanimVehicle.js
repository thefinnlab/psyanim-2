import Phaser from 'phaser';

import PsyanimConstants from "../PsyanimConstants";
import PsyanimGeomUtils from '../PsyanimGeomUtils';

export default class PsyanimVehicle extends Phaser.Physics.Matter.Sprite {

    constructor(scene, name, x = 200, y = 200, shapeParams = {}) {

        const defaultShapeParams = {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
            base: 30, altitude: 60, 
            width: 20, height: 20, 
            radius: 30, 
            color: 0xffff00};

        let textureKey = 'vehicle_' + name;

        let matterConfig = {};

        let matterOptions = {
            label: name,
            collisionFilter: {
                category: PsyanimConstants.COLLISION_CATEGORIES.DEFAULT,
                mask: PsyanimConstants.COLLISION_CATEGORIES.DEFAULT | 
                    PsyanimConstants.COLLISION_CATEGORIES.SCREEN_BOUNDARY
            }
        };

        let shapeType = (shapeParams.shapeType) ? shapeParams.shapeType : defaultShapeParams.shapeType;
        let color = (shapeParams.color) ? shapeParams.color : defaultShapeParams.color;

        switch(shapeType)
        {
            case PsyanimConstants.SHAPE_TYPE.CIRCLE:

                let radius = (shapeParams.radius) ? shapeParams.radius : defaultShapeParams.radius;

                let circleGeomParams = {
                    radius: radius
                };

                PsyanimGeomUtils.generateCircleTexture(scene, textureKey, circleGeomParams, color);

                matterConfig.type = 'circle';
                matterConfig.radius = circleGeomParams.radius;

                break;

            case PsyanimConstants.SHAPE_TYPE.TRIANGLE:

                let base = (shapeParams.base) ? shapeParams.base : defaultShapeParams.base;
                let altitude = (shapeParams.altitude) ? shapeParams.altitude : defaultShapeParams.altitude;
    
                let triangleGeomParams = {
                    base: base, altitude: altitude
                };

                PsyanimGeomUtils.generateTriangleTexture(scene, textureKey, triangleGeomParams, color);
    
                matterConfig.type = 'fromVertices';
                matterConfig.verts = PsyanimGeomUtils.computeTriangleVertices(base, altitude);
    
                break;

            case PsyanimConstants.SHAPE_TYPE.RECTANGLE:

                let width = (shapeParams.width) ? shapeParams.width : defaultShapeParams.width;
                let height = (shapeParams.height) ? shapeParams.height : defaultShapeParams.height;

                let rectangleGeomParams = {
                    width: width, height: height
                };

                PsyanimGeomUtils.generateRectangleTexture(scene, textureKey, rectangleGeomParams, color);

                matterConfig.type = 'rectangle';
                matterConfig.width = width;
                matterConfig.height = height;

                break;
        }

        super(scene.matter.world, x, y, textureKey);

        this.setBody(matterConfig, matterOptions);

        scene.add.existing(this);
    }

    update(t, dt) {

    }
}