import PsyanimConstants from '../../src/core/PsyanimConstants.js';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController.js';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController.js';
import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle.js';

import PsyanimMouseFollowTarget from '../../src/core/components/controllers/PsyanimMouseFollowTarget.js';

import PsyanimBehaviorTreeBlackboard from '../../src/core/components/ai/bt/PsyanimBehaviorTreeBlackboard.js';
import PsyanimAIController from '../../src/core/components/ai/bt/PsyanimAIController.js';

import PredatorChase from '../data/PredatorChase.json';
import PredatorChaseBlackboard from '../data/PredatorChase.bb.json';

import PsyanimBehaviorTreeDebugger from '../../src/core/components/ai/bt/PsyanimBehaviorTreeDebugger.js';

import PsyanimBlackboardTargetDistance from '../../src/core/components/ai/bt/writers/PsyanimBlackboardTargetDistance.js';

export default {

    key: 'Behavior Tree Predator Test',
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
                        behaviorTreeDefinition: PredatorChase
                    }
                },
                {
                    type: PsyanimBehaviorTreeBlackboard,
                    params: {
                        name: 'Agent Blackboard',
                        file: PredatorChaseBlackboard,
                        chaseTarget: {
                            entityName: 'mouseFollowTarget'
                        }
                    }
                }
            ]
        },
    ]
};