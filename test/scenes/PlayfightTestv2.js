import PsyanimConstants from '../../src/core/PsyanimConstants.js';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController.js';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController.js';
import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle.js';

import PsyanimPlayfightFSM from '../../src/core/components/ai/playfight/PsyanimPlayfightFSM.js';
import PsyanimPlayfightSeparationFSM from '../../src/core/components/ai/playfight/PsyanimPlayfightSeparationFSM.js';

import PsyanimPlayfightHFSM from '../../src/core/components/ai/playfight/PsyanimPlayfightHFSM.js';

const maxChargeSpeed = 9;
const maxChargeAcceleration = 0.3;

const breakDurationVariance = 100;
const minWanderDuration = 150; // TODO: this parameter possibly needs to be calculated, not configurable...
const averageChargeDelay = 100;
const chargeDelayVariance = 10;

const maxChargeDuration = 2000;

const wanderFleeRate = 0;

const minTargetDistanceForCharge = 200;
const maxTargetDistanceForCharge = 500;

export default {

    key: 'Playfight Test v2',
    wrapScreenBoundary: false,
    entities: [
        {
            name: 'sceneControls',
            components: [
                { type: PsyanimSceneTitle },
                { 
                    type: PsyanimPhysicsSettingsController,
                    params: {
                        slowTimeScale: 0.5
                    }
                },
                { type: PsyanimSceneChangeController }
            ]
        },
        {
            name: 'agent1',
            initialPosition: { x: 250, y: 300 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
                radius: 12, color: 0x808080
            },
            components: [
                { 
                    type: PsyanimPlayfightFSM,
                    params: {

                        // wander state
                        breakDurationAverage: 2000,
                        breakDurationVariance: breakDurationVariance,
                        minWanderDuration: minWanderDuration,
                        minTargetDistanceForCharge: minTargetDistanceForCharge,
                        maxTargetDistanceForCharge: maxTargetDistanceForCharge,

                        wanderFleeOrChargeWhenAttacked: true,
                        wanderPanicDistance: 250,
                        wanderFleeRate: wanderFleeRate,

                        // flee state
                        maxFleeDuration: 500,

                        // charge state
                        maxChargeDuration: maxChargeDuration,

                        // charge delay state
                        averageChargeDelay: averageChargeDelay,
                        chargeDelayVariance: chargeDelayVariance,

                        // arrive behavior
                        maxChargeSpeed: maxChargeSpeed,
                        maxChargeAcceleration: maxChargeAcceleration,

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
                        
                        maxSeparationSpeed: 9,
                        maxSeparationAcceleration: 0.3,
                    }
                },
                {
                    type: PsyanimPlayfightHFSM,
                    params: {

                        maxSeparationDuration: 100,

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
            initialPosition: { x: 550, y: 300 },
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
                        breakDurationVariance: breakDurationVariance,
                        minWanderDuration: minWanderDuration,
                        minTargetDistanceForCharge: minTargetDistanceForCharge,
                        maxTargetDistanceForCharge: maxTargetDistanceForCharge,

                        wanderFleeOrChargeWhenAttacked: true,
                        wanderPanicDistance: 250,
                        wanderFleeRate: wanderFleeRate,

                        // flee state
                        maxFleeDuration: 500,

                        // charge state
                        maxChargeDuration: maxChargeDuration,

                        // charge delay state
                        averageChargeDelay: averageChargeDelay,
                        chargeDelayVariance: chargeDelayVariance,

                        // arrive behavior
                        maxChargeSpeed: maxChargeSpeed,
                        maxChargeAcceleration: maxChargeAcceleration,

                        innerDecelerationRadius: 12,
                        outerDecelerationRadius: 30,

                        // wander behavior
                        maxWanderSpeed: 3,
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

                        maxSeparationSpeed: 9,
                        maxSeparationAcceleration: 0.3,
                    }
                },
                {
                    type: PsyanimPlayfightHFSM,
                    params: {
                        
                        maxSeparationDuration: 100,

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