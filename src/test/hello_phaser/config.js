import Phaser from 'phaser';

import InfiniteRunner from './scenes/InfiniteRunner';

import GameOverScene from './scenes/GameOverScene';

export default class Config {

    static get() {

        return {
            type: Phaser.AUTO,
            width: 480,
            height: 640,
            scene: [InfiniteRunner, GameOverScene],
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: {
                        y: 200
                    },
                    debug: true
                }
            }
        };
    }
}