import PsyanimDataDrivenScene from '../../src/core/PsyanimDataDrivenScene';

import PsyanimConstants from '../../src/core/PsyanimConstants';
import PsyanimMouseFollowTarget from '../../src/core/components/controllers/PsyanimMouseFollowTarget';

import PsyanimArriveAgentPrefab from '../../src/core/prefabs/PsyanimArriveAgentPrefab';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';
import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

export default class ArriveTest extends PsyanimDataDrivenScene {

    constructor() {

        super('ArriveTest');
    }

    init() {

        super.init();

        // arrive test
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
                    name: 'agent1',
                    initialPosition: { x: 600, y: 450 },
                    shapeParams: {
                        shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
                        base: 16, altitude: 32, 
                        color: 0xffc0cb            
                    },
                    prefabType: PsyanimArriveAgentPrefab,
                    prefabParams: {
                        target: {
                            entityName: 'mouseFollowTarget',
                        },
                    }
                }
            ]
        });
    }
}