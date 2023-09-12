import PsyanimConstants from "../../src/core/PsyanimConstants";

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';
import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

import PsyanimPredatorPrefab from '../../src/core/prefabs/PsyanimPredatorPrefab';
import PsyanimPredatorAgent from '../../src/core/components/steering/agents/PsyanimPredatorAgent';

import PsyanimPreyPrefab from '../../src/core/prefabs/PsyanimPreyPrefab';
import PsyanimPreyAgent from '../../src/core/components/steering/agents/PsyanimPreyAgent';

export default {
    key: 'PredatorPrey',
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
            name: 'predator',
            initialPosition: { x: 100, y: 100 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
                radius: 12, color: 0xff0000
            },
            prefab: { 
                type: PsyanimPredatorPrefab,
                params: {
                    maxChaseSpeed: 5,
                    maxWanderSpeed: 4.5,
                    boredomDistance: 250,
                    showDebugGraphics: true,
                    showDebugLogs: true,
                    subtlety: 30
                }
            },
            components: [
                {
                    type: PsyanimPredatorAgent,
                    params: {
                        target: {
                            entityName: 'prey'
                        }
                    }    
                }
            ]
        },
        {
            name: 'prey',
            initialPosition: { x: 700, y: 500 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
                radius: 12, color: 0x0000ff
            },
            prefab: { 
                type: PsyanimPreyPrefab,
                params: {
                    maxFleeSpeed: 10,
                    maxWanderSpeed: 5.0,
                    showDebugGraphics: true,
                    showDebugLogs: true,
                    safetyDistance: 250,
                }
            },
            components: [
                {
                    type: PsyanimPreyAgent,
                    params: {
                        target: {
                            entityName: 'predator'
                        }
                    }    
                }
            ]
        }
    ],
}