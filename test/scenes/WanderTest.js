import PsyanimDataDrivenScene from '../../src/core/PsyanimDataDrivenScene';

import PsyanimConstants from '../../src/core/PsyanimConstants';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';
import PsyanimWanderAgentPrefab from '../../src/core/prefabs/PsyanimWanderAgentPrefab';

export default class WanderTest extends PsyanimDataDrivenScene {

    constructor() {

        super('WanderTest');
    }

    init() {

        super.init();

        // wander test
        this.registry.set('psyanim_currentSceneDefinition', {

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
                    name: 'agent',
                    instances: 20,
                    initialPosition: 'random',
                    shapeParams: {
                        textureKey: 'wanderTestTexture',
                        shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
                        base: 16, altitude: 32, 
                        color: 0xffc0cb            
                    },
                    prefab: {
                        type: PsyanimWanderAgentPrefab,
                        params: {
                            debug: false
                        }
                    }
                }
            ]
        });
    }
}