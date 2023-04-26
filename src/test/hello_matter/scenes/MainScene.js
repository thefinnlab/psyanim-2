import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {

    constructor() {

        super('main');
    }

    init() {

        this.speed = 7;
        this.turnSpeed = 0.15;

    }

    preload() {

        this.keys = {
            W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        }
    }

    create() {

        this.player = this.createTriangleShapedPlayer(400, 300, 30, 60);
        // this.player = this.createCircleShapedPlayer();
    }

    update(t, dt) {

        let horizontal = (this.keys.A.isDown ? -1 : 0) + (this.keys.D.isDown ? 1 : 0);
        let vertical = (this.keys.W.isDown ? -1 : 0) + (this.keys.S.isDown ? 1 : 0);

        this.player.setVelocity(horizontal * this.speed, vertical * this.speed);

        if (Math.abs(horizontal) > 1e-3 || Math.abs(vertical) > 1e-3)
        {
            let targetAngle = Math.atan2(vertical, horizontal);

            let newAngle = Phaser.Math.Angle.RotateTo(
                this.player.angle * Math.PI / 180,
                targetAngle,
                this.turnSpeed);

            this.player.setAngle(newAngle * 180 / Math.PI);
        }
    }

    createTriangleShapedPlayer(x = 400, y = 300, base = 12, altitude = 24, color = 0x0000ff) {

        let textureKey = 'triangle';
        this.generateTriangleTexture(textureKey, x, y, base, altitude);
        return this.createTriangleSprite(textureKey, x, y, base, altitude);
    }

    computeTriangleVertices(base, altitude) {

        return [

            {x: -altitude * (1/3), y: -base / 2},
            {x: altitude * (2/3), y: 0 },
            {x: -altitude * (1/3), y: base / 2},
        ];
    }

    generateTriangleTexture(name, x = 400, y = 300, base = 12, altitude = 24, color = 0x0000ff) {

        let verts = this.computeTriangleVertices(base, altitude);

        let graphics = this.add.graphics();
        graphics.fillStyle(color);
        graphics.fillTriangle(
            verts[0].x + x, verts[0].y + y,
            verts[1].x + x, verts[1].y + y,
            verts[2].x + x, verts[2].y + y
        );
        graphics.generateTexture(name);
        graphics.destroy();
    }

    createTriangleSprite(textureKey, x = 400, y = 300, base = 12, altitude = 24) {

        let verts = this.computeTriangleVertices(base, altitude);

        let sprite = this.matter.add.sprite(x, y, textureKey);

        sprite.setBody({
            type: 'fromVertices',
            verts: verts
        });

        return sprite;
    }

    createCircleShapedPlayer(x = 400, y = 300, radius = 24, color = 0x0000ff) {

        let textureKey = 'circle';
        this.generateCircleTexture(textureKey);
        return this.createCircleSprite(textureKey);
    }

    generateCircleTexture(name, x = 400, y = 300, radius = 24, color = 0x0000ff) {

        let graphics = this.add.graphics();
        graphics.fillStyle(color);
        graphics.fillCircle(x, y, radius);
        graphics.generateTexture(name);
        graphics.destroy();
    }

    createCircleSprite(textureKey, x = 400, y = 300, radius = 24) {

        let sprite = this.matter.add.sprite(x, y, textureKey);

        sprite.setBody({ 
            type: 'circle', 
            radius: radius
        });

        return sprite;
    }
}