import PsyanimConstants from '../../src/core/PsyanimConstants.js';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController.js';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController.js';
import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle.js';

import PsyanimPlayfightFSM from '../../src/core/components/ai/playfight/PsyanimPlayfightFSM.js';
import PsyanimPlayfightSeparationFSM from '../../src/core/components/ai/playfight/PsyanimPlayfightSeparationFSM.js';

import PsyanimPlayfightHFSM from '../../src/core/components/ai/playfight/PsyanimPlayfightHFSM.js';

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
            initialPosition: { x: 50, y: 50 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
                radius: 12, color: 0x00ff00
            },
            components: [
                { 
                    type: PsyanimPlayfightFSM,
                    params: {

                        // wander state
                        breakDurationAverage: 2000,
                        breakDurationVariance: 1000,
                        maxTargetDistanceForCharge: 350,

                        wanderFleeOrChargeWhenAttacked: true,
                        wanderPanicDistance: 250,
                        wanderFleeRate: 0.3,

                        // flee state
                        maxFleeDuration: 500,

                        // charge state
                        maxChargeDuration: 1500,

                        // charge delay state
                        averageChargeDelay: 600,
                        chargeDelayVariance: 400,

                        // arrive behavior
                        maxChargeSpeed: 9,
                        maxChargeAcceleration: 0.4,

                        innerDecelerationRadius: 12,
                        outerDecelerationRadius: 30,

                        // wander behavior
                        maxWanderSpeed: 4,
                        maxWanderAcceleration: 0.2,
                        wanderRadius: 50,
                        wanderOffset: 250,
                        maxWanderAngleChangePerFrame: 20,

                        // flee behavior
                        maxFleeSpeed: 12,
                        maxFleeAcceleration: 0.5,
                        fleePanicDistance: 200,

                        target: {
                            entityName: 'agent2',
                        },
                    }
                },
                {
                    type: PsyanimPlayfightSeparationFSM,
                    params: {
                        target: {
                            entityName: 'agent2'
                        },
                    }
                },
                {
                    type: PsyanimPlayfightHFSM,
                    params: {
                        playfightFSM: {
                            entityName: 'agent1',
                            componentType: PsyanimPlayfightFSM
                        },
                        separationFSM: {
                            entityName: 'agent1',
                            componentType: PsyanimPlayfightSeparationFSM
                        },
                        debug: true
                    }
                }
            ]
        },
        {
            name: 'agent2',
            initialPosition: { x: 350, y: 250 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
                radius: 12, color: 0x000000
            },
            components: [
                { 
                    type: PsyanimPlayfightFSM,
                    params: {

                        // wander state
                        breakDurationAverage: 2000,
                        breakDurationVariance: 1000,
                        maxTargetDistanceForCharge: 350,

                        wanderFleeOrChargeWhenAttacked: true,
                        wanderPanicDistance: 250,
                        wanderFleeRate: 0.3,

                        // flee state
                        maxFleeDuration: 500,

                        // charge state
                        maxChargeDuration: 1500,

                        // charge delay state
                        averageChargeDelay: 600,
                        chargeDelayVariance: 400,

                        // arrive behavior
                        maxChargeSpeed: 9,
                        maxChargeAcceleration: 0.4,

                        innerDecelerationRadius: 12,
                        outerDecelerationRadius: 30,

                        // wander behavior
                        maxWanderSpeed: 4,
                        maxWanderAcceleration: 0.2,
                        wanderRadius: 50,
                        wanderOffset: 250,
                        maxWanderAngleChangePerFrame: 20,

                        // flee behavior
                        maxFleeSpeed: 12,
                        maxFleeAcceleration: 0.5,
                        fleePanicDistance: 200,

                        target: {
                            entityName: 'agent1'
                        },
                    }
                },
                {
                    type: PsyanimPlayfightSeparationFSM,
                    params: {
                        target: {
                            entityName: 'agent1'
                        },
                    }
                },
                {
                    type: PsyanimPlayfightHFSM,
                    params: {
                        playfightFSM: {
                            entityName: 'agent2',
                            componentType: PsyanimPlayfightFSM
                        },
                        separationFSM: {
                            entityName: 'agent2',
                            componentType: PsyanimPlayfightSeparationFSM
                        },
                        debug: true
                    }
                }

            ]
        }
    ]
};