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
            initialPosition: { x: 200, y: 300 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
                radius: 12, color: 0xff0000
            },
            prefab: { 
                type: PsyanimPredatorPrefab,
                params: {
                    showDebugLogs: true,
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
            initialPosition: { x: 700, y: 300 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
                radius: 12, color: 0x0000ff
            },
            prefab: { 
                type: PsyanimPreyPrefab,
                params: {
                    showDebugLogs: true,
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
                },
            ]
        }
    ],
}