import PsyanimConstants from "../../src/core/PsyanimConstants.js";

import PsyanimSceneTitle from "../../src/core/components/ui/PsyanimSceneTitle.js";
import PsyanimPhysicsSettingsController from "../../src/core/components/controllers/PsyanimPhysicsSettingsController.js";
import PsyanimSceneChangeController from "../../src/core/components/controllers/PsyanimSceneController.js";

import PsyanimPlayerController from "../../src/core/components/controllers/PsyanimPlayerController.js";

import PsyanimPreyPrefab from '../../src/core/prefabs/PsyanimPreyPrefab.js';
import PsyanimPreyAgent from '../../src/core/components/steering/agents/PsyanimPreyAgent.js';
import PsyanimBasicPreyBehavior from '../../src/core/components/steering/PsyanimBasicPreyBehavior.js';

export default {
    key: 'Prey Test',
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
            name: 'player',
            initialPosition: { x: 400, y: 300 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
                base: 16, altitude: 32, 
                color: 0x0000ff
            },
            components: [
                {
                    type: PsyanimPlayerController,
                    params: {
                        speed: 2
                    }
                }
            ]
        },
        {
            name: 'prey',
            initialPosition: { x: 100, y: 100 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
                base: 16, altitude: 32, color: 0xffff00
            },
            prefab: { 
                type: PsyanimPreyPrefab,
            },
            components: [
                {
                    type: PsyanimBasicPreyBehavior,
                    params: {
                        debug: true,
                        movementLag: 4000,
                        // movementLagDetectionTarget: {
                        //     entityName: 'player'
                        // }
                    }
                },
                {
                    type: PsyanimPreyAgent,
                    params: {
                        target: {
                            entityName: 'player'
                        }
                    }    
                }
            ]
        }
    ]
};