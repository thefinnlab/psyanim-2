import PsyanimApp from '../../src/core/PsyanimApp';

import PsyanimExperimentManager from '../../src/core/components/experiments/PsyanimExperimentManager';

import ExperimentDefinition from './ExperimentDefinition';

/**
 *  TODOs:
 * 
 *      - implement playback viewer for psyanim experiments!
 *      - update README!
 * 
 */

// startup PsyanimApp
PsyanimApp.Instance.run(ExperimentDefinition);

/**
 *  Setup communication between other DOM scripts and PsyanimApp
 */

window.psyanimApp = PsyanimApp.Instance;

window.psyanimApp.currentPlayerID = 'tester1234';

document.addEventListener('keydown', (event) => {

    if (event.key == 'Enter')
    {
        let experimentManager = PsyanimApp.Instance.currentScene
            .getComponentByType(PsyanimExperimentManager);

        experimentManager.loadNextScene();
    }
});