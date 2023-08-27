import Phaser from 'phaser';

import PsyanimDataDrivenScene from '../../src/core/PsyanimDataDrivenScene';

import PsyanimConstants from '../../src/core/PsyanimConstants';

import PsyanimPlayfightAgentPrefab from '../../src/core/prefabs/PsyanimPlayfightAgentPrefab';
import PsyanimPlayfightAgent from '../../src/core/components/steering/agents/PsyanimPlayfightAgent';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

export default class PsyanimPlayfightTest extends PsyanimDataDrivenScene {

    static KEY = 'Playfight Test';

    constructor() {

        super(PsyanimPlayfightTest.KEY);
    }

    init() {

        super.init();

        // playfight test scene definition:

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
                    name: 'agent1',
                    initialPosition: { x: 200, y: 300 },
                    shapeParams: {
                        shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
                        base: 16, altitude: 32, radius: 12, color: 0xff0000
                    },
                    prefab: {
                        type: PsyanimPlayfightAgentPrefab,
                    },
                    components: [
                        {
                            type: PsyanimPlayfightAgent,
                            params: {
                                target: {
                                    entityName: 'agent2'
                                }        
                            }
                        }
                    ]
                },
                {
                    name: 'agent2',
                    initialPosition: { x: 600, y: 300 },
                    shapeParams: {
                        shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
                        base: 16, altitude: 32, radius: 12, color: 0x0000ff
                    },
                    prefab: {
                        type: PsyanimPlayfightAgentPrefab,
                        params: {
                            debug: true,
                        }
                    },
                    components: [
                        {
                            type: PsyanimPlayfightAgent,
                            params: {
                                target: {
                                    entityName: 'agent1'
                                }        
                            }
                        }
                    ]
                }
            ]
        });
    }
}