import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {

    constructor() {
        super('infinite_runner_game_over');
    }

    create() {

        this.add.text(
            this.scale.width * 0.5, this.scale.height * 0.5,
            'Game Over', { fontSize: 48 })
            .setOrigin(0.5);

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('infinite_runner_game');
        });
    }
}