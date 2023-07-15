import Phaser from 'phaser';

import PsyanimComponent from "../../PsyanimComponent";

export default class PsyanimBasicPredatorBehavior extends PsyanimComponent {

    static STATE = {
        WANDERING: 0x0001,
        PURSUING: 0x0002,
    };

    
}