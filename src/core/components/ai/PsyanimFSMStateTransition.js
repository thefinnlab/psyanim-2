import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

export default class PsyanimFSMStateTransition extends PsyanimComponent {

    constructor(entity) {

        super(entity);
    }

    get targetState() {

        console.error("TODO: implement");
        return null;
    }

    get isTriggered() {

        console.error("TODO: implement");
        return null;
    }
}