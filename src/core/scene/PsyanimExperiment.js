import Phaser from 'phaser';

import PsyanimScene from './PsyanimScene';

import PsyanimExperimentTimer from '../components/utils/PsyanimExperimentTimer';

export default class PsyanimExperiment extends PsyanimScene {

    constructor(key) {

        super(key);

        this._duration = 200;

        this._currentParameterSetIndex = 0;
        this._parameterSets = [];
    };

    addParameterSet(parameterSet) {

        if (!parameterSet)
        {
            console.error("ERROR: parameterSet is null!");
        }

        let parameterSetCopy = JSON.parse(JSON.stringify(parameterSet));

        this._parameterSets.push(parameterSetCopy);
    }

    get currentParameterSet() {

        return this._currentParameterSet;
    }

    init() {

        super.init();

        // update current parameter set
        if (this._parameterSets.length == 0)
        {
            console.error("ERROR: No parameter sets added to experiment!");

            this.scene.start('EmptyScene');
        }

        this._currentParameterSet = this._parameterSets[this._currentParameterSetIndex];

        this._duration = this._currentParameterSet.experimentDuration;

        console.log("Experiment" + (this._currentParameterSetIndex + 1) + " start time: " + this.time.now / 1000);
        console.log("Experiment " + (this._currentParameterSetIndex + 1) + " duration: " + this._duration / 1000);

        this._currentParameterSetIndex++;

        if (this._currentParameterSetIndex >= this._parameterSets.length)
        {
            this._currentParameterSetIndex = -1;
        }
    }

    preload() {

        super.preload();
    }

    create() {

        super.create();

        let sceneKey = this.scene.key;

        if (this._currentParameterSetIndex == -1)
        {
            sceneKey = 'EmptyScene';
        }

        this.addEntity('_experimentTimer')
            .addComponent(PsyanimExperimentTimer)
            .setOnTimerElapsed(this._duration, () => {

                this.scene.start(sceneKey);
        });
    }

    update(t, dt) {

        super.update(t, dt);
    }
}