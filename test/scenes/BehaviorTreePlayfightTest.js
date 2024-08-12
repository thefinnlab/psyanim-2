import PsyanimConstants from '../../src/core/PsyanimConstants.js';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController.js';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController.js';
import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle.js';

import PsyanimMouseFollowTarget from '../../src/core/components/controllers/PsyanimMouseFollowTarget.js';

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
                        behaviorTreeAgentNames: ['Agent']
                    }
                }
            ]
        },
        {
            name: 'mouseFollowTarget',
            initialPosition: { x: 400, y: 300 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
                radius: 4,
                color: 0x00ff00
            },
            components: [
                { type: PsyanimMouseFollowTarget }
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
                        behaviorTreeDefinition: PlayfightTest
                    }
                },
                {
                    type: PsyanimBehaviorTreeBlackboard,
                    params: {
                        name: 'PatrolFlee Test',
                    }
                }
            ]
        },
    ]
};