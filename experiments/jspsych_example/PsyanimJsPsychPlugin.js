import { ParameterType } from 'jspsych';

import PsyanimApp from '../../src/core/PsyanimApp';

/**
 *  _PsyanimJsPsychPlugin is a private singleton instance that maintains state across all trials
 *  and handles all communication with PsyanimApp.
 */
class _PsyanimJsPsychPlugin {

    static get Instance() {

        if (_PsyanimJsPsychPlugin._instance == null)
        {
            _PsyanimJsPsychPlugin._instance = new _PsyanimJsPsychPlugin();
        }

        return _PsyanimJsPsychPlugin._instance;
    }

    static _instance = null;

    constructor() {

        console.log("Psyanim jsPsych plugin initialized!");
    }

    get jsPsych() {

        return this._jsPsych;
    }

    set jsPsych(value) {

        this._jsPsych = value;
    }

    beginNextTrial(display_element, trial) {

        // TODO: add some error checking on the parameter set!

        console.log("starting next trial!");

        // add phaser game canvas to display element
        this._displayElement = display_element;

        display_element.appendChild(PsyanimApp.Instance.domElement);

        PsyanimApp.Instance.setCanvasVisible(true);

        // load scene and add parameter-set to game registry
        PsyanimApp.Instance.loadScene(trial.sceneKey);

        PsyanimApp.Instance.game.registry.set('psyanim_currentParameterSet', trial.sceneParameters);
    }

    endTrial() {

        console.log("ending trial - current scene is: " + PsyanimApp.Instance.currentScene.scene.key);

        // remove phaser game canvas from display element
        PsyanimApp.Instance.setCanvasVisible(false);

        this._displayElement.removeChild(PsyanimApp.Instance.domElement);

        this._displayElement = null;

        // this must be called to end the trial and proceed to the next one!
        this._jsPsych.finishTrial();
    }
}

export default class PsyanimJsPsychPlugin {

    static info = {
            name: 'psyanim-jsPsych-plugin',
            parameters: {

                sceneKey: {
                    type: ParameterType.HTML_STRING,
                    default: undefined
                },

                sceneParameters: {
                    type: ParameterType.OBJECT,
                    default: {}
                },
            }
    };

    constructor(jsPsych) {

        _PsyanimJsPsychPlugin.Instance.jsPsych = jsPsych;
    }

    trial(display_element, trial) {

        _PsyanimJsPsychPlugin.Instance.beginNextTrial(display_element, trial);;

        console.log(trial);

        // let Psyanim process keys related to interactivity, but have jsPsych
        // process keystrokes related to GUI & progressing the experiment
        _PsyanimJsPsychPlugin.Instance.jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: this.handleKeypress,
            valid_responses: ['enter'], // can also be any keycode, e.g. ' ' for space, 'i', 'u', etc...f
            persist: false
        });
    }

    handleKeypress(info) {

        // 'info.key' contains the character keycode pressed

        _PsyanimJsPsychPlugin.Instance.endTrial();
    }
}