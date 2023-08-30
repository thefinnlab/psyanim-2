import PsyanimScene from '../../src/core/PsyanimScene';

import PsyanimConstants from "../../src/core/PsyanimConstants";

import PsyanimSceneTitle from "../../src/core/components/ui/PsyanimSceneTitle";
import PsyanimPhysicsSettingsController from "../../src/core/components/controllers/PsyanimPhysicsSettingsController";
import PsyanimSceneChangeController from "../../src/core/components/controllers/PsyanimSceneController";

import PsyanimPlayerController from "../../src/core/components/controllers/PsyanimPlayerController";

import PsyanimPredatorPrefab from '../../src/core/prefabs/PsyanimPredatorPrefab';
import PsyanimPredatorAgent from '../../src/core/components/steering/agents/PsyanimPredatorAgent';

export default {
    key: 'Predator Test',
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
            name: 'predator',
            initialPosition: { x: 100, y: 100 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
                base: 16, altitude: 32, color: 0xffff00
            },
            prefab: { type: PsyanimPredatorPrefab },
            components: [
                {
                    type: PsyanimPredatorAgent,
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