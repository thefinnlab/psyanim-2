import PsyanimConstants from '../../src/core/PsyanimConstants.js';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController.js';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController.js';
import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle.js';

import PsyanimPlayfightFSM from '../../src/core/components/ai/playfight/PsyanimPlayfightFSM.js';
import PsyanimPlayfightSeparationFSM from '../../src/core/components/ai/playfight/PsyanimPlayfightSeparationFSM.js';

import PsyanimPlayfightHFSM from '../../src/core/components/ai/playfight/PsyanimPlayfightHFSM.js';

/**
 *  NOTE: 'minWanderDuration' needs to be larger than the sum of (averageChargeDelay + chargeDelayVariance)
 *  but smaller than the difference of (breakDurationAverage - breakDurationVariance).
 * 
 *  The purpose of this parameter is to prevent an agent from performing a 'charge back' multiple times
 *  by guaranteeing that, after returning to the wander state (which only happens after a charge or flee),
 *  it can't transition out of wander state until it has been in it longer than the other agent's 
 *  charge delay.
 */

// arrive behavior
const maxChargeSpeed = 9;
const maxChargeAcceleration = 0.5;

// charge state
const maxChargeDuration = 2000;

// wander state
const breakDurationAverage = 2000;
const breakDurationVariance = 500;

const minWanderDuration = 700; // see notes above

const minTargetDistanceForCharge = 250;
const maxTargetDistanceForCharge = 500;

const wanderPanicDistance = 450;

const wanderFleeRate = 0;

// charge delay state
const averageChargeDelay = 500;
const chargeDelayVariance = 50;

// wander behavior
const maxWanderSpeed = 3;

/**
 *  Parameters below here are the same for both agents, and defined above so we don't have to update
 *  each agent individually every time we want to change one parameter to observe its effect.
 */

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
                        breakDurationAverage: breakDurationAverage,
                        breakDurationVariance: breakDurationVariance,
                        minWanderDuration: minWanderDuration,
                        minTargetDistanceForCharge: minTargetDistanceForCharge,
                        maxTargetDistanceForCharge: maxTargetDistanceForCharge,

                        wanderFleeOrChargeWhenAttacked: true,
                        wanderPanicDistance: wanderPanicDistance,
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
                        maxWanderSpeed: maxWanderSpeed,
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
                        debugLogging: false,
                        debugGraphics: true
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
                        breakDurationAverage: breakDurationAverage,
                        breakDurationVariance: breakDurationVariance,
                        minWanderDuration: minWanderDuration,
                        minTargetDistanceForCharge: minTargetDistanceForCharge,
                        maxTargetDistanceForCharge: maxTargetDistanceForCharge,

                        wanderFleeOrChargeWhenAttacked: true,
                        wanderPanicDistance: wanderPanicDistance,
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
                        maxWanderSpeed: maxWanderSpeed,
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
                        debugLogging: false,
                        debugGraphics: true
                    }
                }

            ]
        }
    ]
};