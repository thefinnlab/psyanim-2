import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent.js';

/**
 *  Simple click-to-move controller that moves in a straight line to clicked location on canvas.
 * 
 *  This class makes no attempt to navigate around obstacles.  For a canvas with obstacles, 
 *  use `PsyanimClickToMove` with a pathfinder on a navigation grid.
 */
export default class PsyanimClickToMoveBasic extends PsyanimComponent { 

    /**
     * 
     * @param {PsyanimEntity} entity 
     */
    constructor(entity) {

        super(entity);

        this._arriveTarget = this.scene.addEntity('arriveTarget');

        this._arriveAgent = null;

        this.scene.input.on('pointerup', (pointer) => {

            if (pointer.leftButtonReleased())
            {
                this._arriveTarget.position = new Phaser.Math.Vector2(pointer.x, pointer.y);
            }
        });
    }

    /**
     *  Sets the arrive agent this controller uses for locomotion.
     * 
     *  @type {PsyanimArriveAgent} value
     */
    set arriveAgent(value) {

        this._arriveAgent = value;
        this._arriveAgent.target = this._arriveTarget;

        this._arriveTarget.position = this._arriveAgent.entity.position;
    }
}