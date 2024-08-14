import PsyanimConstants from '../../src/core/PsyanimConstants.js';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController.js';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController.js';
import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle.js';

import PsyanimBehaviorTreeBlackboard from '../../src/core/components/ai/bt/PsyanimBehaviorTreeBlackboard.js';
import PsyanimAIController from '../../src/core/components/ai/bt/PsyanimAIController.js';

import PlayfightTest from '../data/PlayfightTest.json';

import PsyanimBehaviorTreeDebugger from '../../src/core/components/ai/bt/PsyanimBehaviorTreeDebugger.js';

export default {

    key: 'Behavior Tree Playfight Test',
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
                        behaviorTreeAgentNames: ['Agent1', 'Agent2']
                    }
                }
            ]
        },
        {
            name: 'Agent1',
            initialPosition: { x: 400, y: 300 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
                radius: 12,
                color: 0x00ff00
            },
            components: [
                {
                    type: PsyanimAIController,
                    params: {
                        taskDefinitions: [],
                        behaviorTreeDefinition: PlayfightTest
                    }
                },
                {
                    type: PsyanimBehaviorTreeBlackboard,
                    params: {
                        name: 'PatrolFlee Test',
                        chargeTarget: {
                            entityName: 'Agent2'
                        }
                    }
                }
            ]
        },
        {
            name: 'Agent2',
            initialPosition: { x: 400, y: 300 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
                radius: 12,
                color: 0x0000ff
            },
            components: [
                {
                    type: PsyanimAIController,
                    params: {
                        taskDefinitions: [],
                        behaviorTreeDefinition: PlayfightTest
                    }
                },
                {
                    type: PsyanimBehaviorTreeBlackboard,
                    params: {
                        name: 'PatrolFlee Test',
                        chargeTarget: {
                            entityName: 'Agent1'
                        }
                    }
                }
            ]
        },
    ]
};