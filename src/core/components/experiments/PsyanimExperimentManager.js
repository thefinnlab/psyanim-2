import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

class _PsyanimExperimentManager {

    static get Instance() {

        if (_PsyanimExperimentManager._instance == null)
        {
            _PsyanimExperimentManager._instance = new _PsyanimExperimentManager();
        }

        return _PsyanimExperimentManager._instance;
    }

    static _instance = null;

    constructor() {

        this._currentParameterSet = null;
        this._parameterSets = [];
    }
}

export default class PsyanimExperimentManager extends PsyanimComponent {

    constructor(entity) {

        super(entity);
    }
}