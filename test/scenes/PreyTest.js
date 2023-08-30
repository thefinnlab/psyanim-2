import PsyanimScene from '../../src/core/PsyanimScene';

import PsyanimConstants from "../../src/core/PsyanimConstants";

import PsyanimSceneTitle from "../../src/core/components/ui/PsyanimSceneTitle";
import PsyanimPhysicsSettingsController from "../../src/core/components/controllers/PsyanimPhysicsSettingsController";
import PsyanimSceneChangeController from "../../src/core/components/controllers/PsyanimSceneController";

import PsyanimPlayerController from "../../src/core/components/controllers/PsyanimPlayerController";

import PsyanimPreyPrefab from '../../src/core/prefabs/PsyanimPreyPrefab';
import PsyanimPreyAgent from '../../src/core/components/steering/agents/PsyanimPreyAgent';

export default {
    key: 'Prey Test',
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
                        speed: 10
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
            prefab: { type: PsyanimPreyPrefab },
            components: [
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