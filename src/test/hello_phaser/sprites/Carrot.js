import Phaser from 'phaser';

import carrotImg from '../textures/kenney_jumper-pack/PNG/Items/carrot.png';

export default class Carrot extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y, texture) {

        super(scene, x, y, texture);

        this.setScale(0.5);
    }
}