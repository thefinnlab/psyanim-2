import Phaser from 'phaser';

import PsyanimScene from '../../src/core/PsyanimScene';

import PsyanimConstants from '../../src/core/PsyanimConstants';
import PsyanimMouseFollowTarget from '../../src/core/components/controllers/PsyanimMouseFollowTarget';
import PsyanimPlayerController from '../../src/core/components/controllers/PsyanimPlayerController';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

import PsyanimSeekAgentPrefab from '../../src/core/prefabs/PsyanimSeekAgentPrefab';
import PsyanimSeekAgent from '../../src/core/components/steering/agents/PsyanimSeekAgent';

export default {

    key: 'Seek Test',
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
            name: 'player',
            initialPosition: { x: 400, y: 300 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
                base: 16, altitude: 32, 
                color: 0x0000ff
            },
            components: [
                { type: PsyanimPlayerController }
            ]
        },
        {
            name: 'agent1',
            initialPosition: { x: 600, y: 450 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
                base: 16, altitude: 32, 
                color: 0xffc0cb
            },
            prefab: {
                type: PsyanimSeekAgentPrefab,
            },
            components: [
                {
                    type: PsyanimSeekAgent,
                    params: {
                        target: {
                            entityName: 'player'
                        }
                    }
                }
            ]
        },
        {
            name: 'agent2',
            initialPosition: { x: 200, y: 150 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE, 
                width: 60, height: 30,
                color: 0xffff00            
            },
            prefab: {
                type: PsyanimSeekAgentPrefab,
                params: {
                    maxSpeed: 6,
                    maxAcceleration: 0.4,
                }
            },
            components: [
                {
                    type: PsyanimSeekAgent,
                    params: {
                        target: {
                            entityName: 'mouseFollowTarget'
                        },
                    }
                }
            ]
        },
        {
            name: 'agent3',
            initialPosition: { x: 200, y: 450 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
                radius: 12,
                color: 0x87ceeb          
            },
            prefab: {
                type: PsyanimSeekAgentPrefab,
                params: {
                    maxSpeed: 4,
                    maxAcceleration: 0.2,
                }
            },
            components: [
                {
                    type: PsyanimSeekAgent,
                    params: {
                        target: {
                            entityName: 'agent2'
                        },
                    }
                }
            ]
        }
    ]
};