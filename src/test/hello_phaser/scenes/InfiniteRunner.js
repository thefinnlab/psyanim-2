import Phaser from 'phaser';

import backgroundImg from '../textures/kenney_jumper-pack/PNG/Background/bg_layer1.png';

import platformImg from '../textures/kenney_jumper-pack/PNG/Environment/ground_grass.png';

import bunnyStandImg from '../textures/kenney_jumper-pack/PNG/Players/bunny1_stand.png';
import bunnyJumpImg from '../textures/kenney_jumper-pack/PNG/Players/bunny1_jump.png';

import carrotImg from '../textures/kenney_jumper-pack/PNG/Items/carrot.png';

import Carrot from '../sprites/Carrot';

export default class InfiniteRunner extends Phaser.Scene {

    constructor() {

        super('infinite_runner_game');
    }

    init() {

        this.gameScore = 0;
    }

    preload() {

        // load images
        this.load.image('background', backgroundImg);
        this.load.image('platform', platformImg);

        this.load.image('bunny-stand', bunnyStandImg);
        this.load.image('bunny-jump', bunnyJumpImg);

        this.load.image('carrot', carrotImg);

        // setup inputs
        this.cursors = this.input.keyboard.createCursorKeys();

        this.keys = {
            W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        }
    }

    create() {

        // add bg
        this.add.image(240, 320, 'background');

        // randomly place 5 platforms
        this.platforms = this.physics.add.staticGroup();

        for (let i = 0; i < 5; ++i)
        {
            const x = Phaser.Math.Between(80, 400);
            const y = 150 * i;

            const platform = this.platforms.create(x, y, 'platform');
            platform.scale = 0.5;

            const body = platform.body;
            body.updateFromGameObject();
        }

        // add player
        this.player = this.physics.add.sprite(240, 320, 'bunny-stand')
            .setScale(0.5);

        this.physics.add.collider(this.platforms, this.player);

        this.player.body.checkCollision.up = false;
        this.player.body.checkCollision.left = false;
        this.player.body.checkCollision.right = false;

        // setup camera
        this.cameras.main.startFollow(this.player);

        // camera shouldn't pan left and right
        this.cameras.main.setDeadzone(this.scale.width * 1.5);

        // create carrot
        this.carrots = this.physics.add.group({
            classType: Carrot
        });

        this.physics.add.collider(this.platforms, this.carrots);

        this.platforms.children.iterate(platform => {

            this.addCarrotAbove(platform);
        });

        this.physics.add.overlap(
            this.player,
            this.carrots,
            this.handleCollectCarrot,
            undefined,
            this
        );

        // add game score text
        const style = { color: '#000', fontSize: 24 };

        this.scoreText = this.add.text(240, 10, 'Carrots: ' + this.gameScore, style)
            .setScrollFactor(0)
            .setOrigin(0.5, 0);
    }

    update(t, dt) {

        // jump logic
        const touchingDown = this.player.body.touching.down;

        if (touchingDown)
        {
            this.player.setVelocityY(-300);

            this.player.setTexture('bunny-jump');
        }

        const v_y = this.player.body.velocity.y;
        if (v_y > 0 && this.player.texture.key !== 'bunny-stand')
        {
            this.player.setTexture('bunny-stand');
        }

        // left and right input logic
        if ((this.keys.A.isDown || this.cursors.left.isDown) && !touchingDown)
        {
            this.player.setVelocityX(-200);
        }
        else if ((this.keys.D.isDown || this.cursors.right.isDown) && !touchingDown)
        {
            this.player.setVelocityX(200);
        }
        else
        {
            this.player.setVelocityX(0);
        }

        // wrap player on screen
        this.horizontalWrap(this.player);

        // check if player died
        const bottomPlatform = this.findBottomMostPlatform();

        if (this.player.y > bottomPlatform.y + 200) {

            this.scene.start('infinite_runner_game_over');
        }
    }

    findBottomMostPlatform() {

        const platforms = this.platforms.getChildren();
        let bottomPlatform = platforms[0];

        for (let i = 1; i < platforms.length; ++i)
        {
            const platform = platforms[i];

            if (platform.y > bottomPlatform.y)
            {
                bottomPlatform = platform;
            }
        }

        return bottomPlatform;
    }

    horizontalWrap(sprite) {

        const halfWidth = sprite.displayWidth * 0.5;
        const gameWidth = this.scale.width;

        if (sprite.x < -halfWidth)
        {
            sprite.x = gameWidth + halfWidth;
        }
        else if (sprite.x > gameWidth + halfWidth)
        {
            sprite.x = -halfWidth;
        }
    }

    addCarrotAbove(sprite) {

        const y = sprite.y - sprite.displayHeight;

        const carrot = this.carrots.get(sprite.x, y, 'carrot');

        this.add.existing(carrot);

        carrot.body.setSize(carrot.width, carrot.height);

        return carrot;
    }

    handleCollectCarrot(player, carrot) {
     
        this.carrots.killAndHide(carrot);

        this.physics.world.disableBody(carrot.body);

        this.gameScore++;

        this.scoreText.text = 'Carrots: ' + this.gameScore;

        if (this.gameScore == 5)
        {
            // load game over scene!
        }
    }
}