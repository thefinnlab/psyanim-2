import PsyanimConstants from "../PsyanimConstants";
import PsyanimGeomUtils from "../PsyanimGeomUtils";

export default class PsyanimPlayerController extends Phaser.Physics.Matter.Sprite {

    constructor(scene, name = 'player', x = 400, y = 300, shapeParams = {}) {

        /**
         *  Setup geometry
         */

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

        /**
         *  Setup controller
         */

        this.scene.events.on('update', (t, dt) => { this.update(t, dt) });

        this.keys = {
            W: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            A: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            S: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            D: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        }

        this.speed = 7;
        this.turnSpeed = 0.15;
    }

    update(t, dt) {

        let horizontal = (this.keys.A.isDown ? -1 : 0) + (this.keys.D.isDown ? 1 : 0);
        let vertical = (this.keys.W.isDown ? -1 : 0) + (this.keys.S.isDown ? 1 : 0);

        this.setVelocity(horizontal * this.speed, vertical * this.speed);

        if (Math.abs(horizontal) > 1e-3 || Math.abs(vertical) > 1e-3)
        {
            let targetAngle = Math.atan2(vertical, horizontal);

            let newAngle = Phaser.Math.Angle.RotateTo(
                this.angle * Math.PI / 180,
                targetAngle,
                this.turnSpeed);

            this.setAngle(newAngle * 180 / Math.PI);
        }
    }
}