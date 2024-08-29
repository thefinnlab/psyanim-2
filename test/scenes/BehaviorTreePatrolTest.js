import PsyanimConstants from '../../src/core/PsyanimConstants.js';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController.js';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController.js';
import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle.js';

import PsyanimBehaviorTreeBlackboard from '../../src/core/components/ai/bt/PsyanimBehaviorTreeBlackboard.js';
import PsyanimAIController from '../../src/core/components/ai/bt/PsyanimAIController.js';

import BasicPatrolTree from '../data/BasicPatrolTest.json';

import PsyanimBehaviorTreeDebugger from '../../src/core/components/ai/bt/PsyanimBehaviorTreeDebugger.js';

export default {

    key: 'Behavior Tree Patrol Test',
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
            name: 'patrolLocation1',
            initialPosition: { x: 100, y: 100 }
        },
        {
            name: 'patrolLocation2',
            initialPosition: { x: 700, y: 100 }
        },
        {
            name: 'btDebugger',
            components: [
                {
                    type: PsyanimBehaviorTreeDebugger,
                    params: {
                        behaviorTreeAgentNames: ['Agent']
                    }
                }
            ]
        },
        {
            name: 'Agent',
            initialPosition: { x: 400, y: 300 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
                base: 16, altitude: 32, 
                color: 0xffc0cb            
            },
            components: [
                {
                    type: PsyanimAIController,
                    params: {
                        taskDefinitions: [],
                        behaviorTreeDefinition: BasicPatrolTree
                    }
                },
                {
                    type: PsyanimBehaviorTreeBlackboard,
                    params: {
                        name: 'My Test Blackboard',

                        stoppingDistance: 50,

                        /** using blackboard keys for string keys is a bit convoluted, but we need to test LOL */
                        patrolTargetKey: 'patrolTarget',
                        patrolTargetListKey: 'patrolTargetList',

                        patrolTargetList: ['patrolLocation1', 'patrolLocation2'],
                    }
                }
            ]
        },
    ]
};