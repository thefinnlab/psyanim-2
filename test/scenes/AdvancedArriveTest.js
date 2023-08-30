import Phaser from 'phaser';

import PsyanimScene from '../../src/core/PsyanimScene';
import PsyanimConstants from '../../src/core/PsyanimConstants';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

import PsyanimAdvancedArriveAgent from '../../src/core/components/steering/agents/PsyanimAdvancedArriveAgent';

import PsyanimMouseFollowTarget from '../../src/core/components/controllers/PsyanimMouseFollowTarget';
import PsyanimAdvancedArriveAgentPrefab from '../../src/core/prefabs/PsyanimAdvancedArriveAgentPrefab';

import AdvancedArriveTestManager from '../components/AdvancedArriveTestManager';

export default {
    key: 'Advanced Arrive Test',
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
            name: 'testManager',
            components: [
                {
                    type: AdvancedArriveTestManager,
                    params: {
                        target: {
                            entityName: 'mouseFollowTarget'
                        },
                        advancedArriveAgent: {
                            entityName: 'agent1',
                            componentType: PsyanimAdvancedArriveAgent
                        },
                        mouseFollowTarget: {
                            entityName: 'mouseFollowTarget',
                            componentType: PsyanimMouseFollowTarget
                        }
                    }
                }
            ]
        },
        {
            name: 'mouseFollowTarget',
            initialPosition: { x: 0, y: 0 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
                radius: 4, color: 0x0000ff
            },
            matterOptions: {
                isSensor: true,
                isSleeping: true
            },
            components: [
                { type: PsyanimMouseFollowTarget }
            ]
        },
        {
            name: 'agent1',
            initialPosition: { x: 50, y: 50 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
                base: 12, altitude: 20, color: 0x00ff00
            },
            prefab: { type: PsyanimAdvancedArriveAgentPrefab },
            components: [
                {
                    type: PsyanimAdvancedArriveAgent,
                    enabled: false,
                    params: {
                        target: { 
                            entityName: 'mouseFollowTarget'
                        },
                    },
                }
            ]
        }
    ]
};