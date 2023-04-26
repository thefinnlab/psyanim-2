import Phaser, { Physics } from 'phaser';

import DefaultScene from './scenes/DefaultScene';

export default class Config {

    static get() {

        return {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            scene: [DefaultScene],
            physics: {
                default: 'matter',
                matter: {
                    debug: true,
                    gravity: {
                        y: 0
                    }
                }
            }
        };
    }
}