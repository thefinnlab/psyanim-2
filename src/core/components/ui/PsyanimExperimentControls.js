import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

export default class PsyanimExperimentControls extends PsyanimComponent {

    editorExperiment = null;

    constructor(entity) {

        super(entity);

        this._startButton = document.createElement("button");

        this._startButton.innerHTML = "Run Experiment";

        this._startButton.onclick = () => this.start();

        this._parentElement = document.getElementById("experiment-controls");

        this._parentElement.appendChild(this._startButton);
    }

    start() {

        this.editorExperiment.start();
        this.setStartButtonEnabled(false);
    }

    setStartButtonEnabled(enabled) {

        this._startButton.disabled = !enabled;
    }

    destroy() {

        super.destroy();

        if (this._startButton)
        {
            const parentElement = document.getElementById("experiment-controls");

            parentElement.removeChild(this._startButton);
            
            this._startButton = null;
        }
    }
}