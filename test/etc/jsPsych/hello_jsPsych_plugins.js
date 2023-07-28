class MyJsPsychPlugin {

    static info = {
            name: 'my-awesome-plugin',
            parameters: {

                speed: {
                    type: jsPsychModule.ParameterType.INT,
                    default: 42    
                },
                target: {
                    type: jsPsychModule.ParameterType.HTML_STRING,
                    default: "enemy"
                },
                myObject: {
                    type: jsPsychModule.ParameterType.OBJECT,
                    default: undefined
                },
                myEvaluatedFunctionParameter: {
                    type: jsPsychModule.ParameterType.INT,
                    default: undefined
                },
                myUnevaluatedFunctionParameter: {
                    type: jsPsychModule.ParameterType.FUNCTION,
                    default: undefined
                }
            }
    };

    constructor(jsPsych) {

        this._jsPsych = jsPsych;
    }

    trial(display_element, trial) {

        console.log("new trial running!");

        trial.myUnevaluatedFunctionParameter();

        console.log(trial);

        this._jsPsych.finishTrial();
    }
}