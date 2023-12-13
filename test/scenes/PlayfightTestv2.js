import PsyanimConstants from '../../src/core/PsyanimConstants.js';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController.js';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController.js';
import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle.js';

import PsyanimPlayfightFSM from '../../src/core/components/ai/playfight/PsyanimPlayfightFSM.js';

export default {

    key: 'Playfight Test v2',
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
            name: 'agent1',
            initialPosition: { x: 200, y: 300 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
                radius: 12, color: 0xff0000
            },
            components: [
                { 
                    type: PsyanimPlayfightFSM,
                    params: {

                        breakDurationAverage: 2000,
                        breakDurationVariance: 1000,
                        maxTargetDistanceForCharge: 350,

                        maxWanderSpeed: 4,
                        maxWanderAcceleration: 0.2,
                        wanderRadius: 50,
                        wanderOffset: 250,
                        maxWanderAngleChangePerFrame: 20,

                        maxChargeSpeed: 9,
                        maxChargeAcceleration: 0.4,

                        target: {
                            entityName: 'agent2',
                        },
                        wanderFleeRate: 0.0,
                        debug: true
                    }
                }
            ]
        },
        {
            name: 'agent2',
            initialPosition: { x: 600, y: 300 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
                radius: 12, color: 0x0000ff
            },
            components: [
                { 
                    type: PsyanimPlayfightFSM,
                    params: {

                        breakDurationAverage: 2000,
                        breakDurationVariance: 1000,
                        maxTargetDistanceForCharge: 350,

                        maxWanderSpeed: 4,
                        maxWanderAcceleration: 0.2,
                        wanderRadius: 50,
                        wanderOffset: 250,
                        maxWanderAngleChangePerFrame: 20,

                        maxChargeSpeed: 9,
                        maxChargeAcceleration: 0.4,

                        target: {
                            entityName: 'agent1'
                        },
                        wanderFleeRate: 0.0,
                        debug: false
                    }
                }
            ]
        }
    ]
};