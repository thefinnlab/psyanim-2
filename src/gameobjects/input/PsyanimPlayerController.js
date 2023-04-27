import PsyanimConstants from "../PsyanimConstants";
import PsyanimGeomUtils from "../PsyanimGeomUtils";

export default class PsyanimPlayerController extends Phaser.Physics.Matter.Sprite {

    constructor(scene, x = 400, y = 300, base = 30, altitude = 60) {

        let textureKey = 'playerTriangle';

        PsyanimGeomUtils.generateTriangleTexture(scene, textureKey, {
            x: 400, y: 300, base: base, altitude: altitude
        });

        let verts = PsyanimGeomUtils.computeTriangleVertices(base, altitude);

        super(scene.matter.world, x, y, textureKey, null);

        // need to set body after initializing so graphics and collision line up nicely
        this.setBody({
            type: 'fromVertices',
            verts: verts
        }, 
        {
            label: 'player',
            collisionFilter: {
                category: PsyanimConstants.COLLISION_CATEGORIES.DEFAULT,
                mask: PsyanimConstants.COLLISION_CATEGORIES.DEFAULT | PsyanimConstants.COLLISION_CATEGORIES.SCREEN_BOUNDARY
            }
        });

        scene.add.existing(this);

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