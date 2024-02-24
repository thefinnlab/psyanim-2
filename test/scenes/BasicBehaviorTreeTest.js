import PsyanimConstants from '../../src/core/PsyanimConstants.js';

import MyBasicBT from '../components/BasicBehaviorTreeTest/MyBasicBT.js';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController.js';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController.js';
import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle.js';

export default {
    key: 'Basic Behavior Tree Test',
    wrapScreenBoundary: false,
    entities: [
        {
            name: 'sceneControls',
            components: [
                { type: PsyanimSceneTitle },
                { type: PsyanimPhysicsSettingsController },
                { type: PsyanimSceneChangeController }
            ]
        },
        {
            name: 'myBasicBT',
            components: [
                { type: MyBasicBT }
            ]
        }
    ],
    navgrid: {
        cellSize: 10,
        obstacles: []
    }
}