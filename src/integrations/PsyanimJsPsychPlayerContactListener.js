import PsyanimComponent from '../core/PsyanimComponent.js';

import PsyanimApp from '../core/PsyanimApp.js';

import {
    PsyanimDebug
} from 'psyanim-utils';

export default class PsyanimJsPsychPlayerContactListener extends PsyanimComponent {

    targetEntityNames;

    constructor(entity) {

        super(entity);

        this.targetEntityNames = [];
    }

    onSensorEnter(entity) {

        super.onSensorEnter(entity);

        PsyanimApp.Instance.events.emit('playerContact', entity);
    }
}