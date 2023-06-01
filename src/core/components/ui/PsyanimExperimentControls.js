import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

export default class PsyanimExperimentControls extends PsyanimComponent {

    constructor(entity) {

        super(entity);

        this._startButton = document.createElement("button");
        this._startButton.innerHTML = "Click Me!";

        this._startButton.onclick = () =>  console.log("it works o/");

        this._parentElement = document.getElementById("experiment-controls");

        this._parentElement.appendChild(this._startButton);
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