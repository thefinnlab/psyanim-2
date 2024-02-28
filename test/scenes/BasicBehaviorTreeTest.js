import PsyanimConstants from '../../src/core/PsyanimConstants.js';

import MyBasicBT from '../components/BasicBehaviorTreeTest/MyBasicBT.js';

import PsyanimBehaviorTreeDebugger from '../../src/core/components/ai/behavior_trees/PsyanimBehaviorTreeDebugger.js';

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
            name: 'agent',
            initialPosition: { x: 400, y: 300 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
                color: 0x0000ff, base: 12, altitude: 24
            },
            components: [
                { type: MyBasicBT },
                { 
                    type: PsyanimBehaviorTreeDebugger,
                    params: {
                        behaviorTreeAgentNames: [ 'agent' ]
                    }
                }
            ]
        }
    ],
    navgrid: {
        cellSize: 10,
        obstacles: []
    }
}