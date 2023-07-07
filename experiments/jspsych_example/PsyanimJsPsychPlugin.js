import { ParameterType } from 'jspsych';

import PsyanimApp from '../../src/core/PsyanimApp';

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

        console.log("starting next trial!");
        PsyanimApp.Instance.setCanvasVisible(true);
    }

    endTrial() {

        // this must be called to end the trial and proceed to the next one!
        PsyanimApp.Instance.setCanvasVisible(false);

        this._jsPsych.finishTrial();
    }
}

export default class PsyanimJsPsychPlugin {

    static info = {
            name: 'psyanim-jsPsych-plugin',
            parameters: {

                speed: {
                    type: ParameterType.INT,
                    default: 42    
                },
                target: {
                    type: ParameterType.HTML_STRING,
                    default: "enemy"
                },
                myObject: {
                    type: ParameterType.OBJECT,
                    default: undefined
                },
                myEvaluatedFunctionParameter: {
                    type: ParameterType.INT,
                    default: undefined
                },
                myUnevaluatedFunctionParameter: {
                    type: ParameterType.FUNCTION,
                    default: undefined
                }
            }
    };

    constructor(jsPsych) {

        _PsyanimJsPsychPlugin.Instance.jsPsych = jsPsych;
    }

    trial(display_element, trial) {

        _PsyanimJsPsychPlugin.Instance.beginNextTrial(display_element, trial);;

        trial.myUnevaluatedFunctionParameter();

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