import PsyanimConstants from '../../src/core/PsyanimConstants.js';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController.js';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController.js';
import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle.js';

import FSMTest from "../components/FSMTest/FSMTest.js";

import PsyanimVehicle from '../../src/core/components/steering/PsyanimVehicle.js';
import PsyanimArriveBehavior from '../../src/core/components/steering/PsyanimArriveBehavior.js';
import PsyanimArriveAgent from '../../src/core/components/steering/agents/PsyanimArriveAgent.js';

import PsyanimPathFollowingAgent from '../../src/core/components/steering/agents/PsyanimPathFollowingAgent.js';

export default {

    key: 'FSM Tests',
    wrapScreenBoundary: true,
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
            name: 'fsmTest',
            components: [
                { type: FSMTest },
                {
                    type: PsyanimVehicle,
                    id: 22
                },
                {
                    type: PsyanimArriveBehavior,
                    params: {
                        maxSpeed: 6,
                        innerDecelerationRadius: 10,
                        outerDecelerationRadius: 50
                    }
                },
                {
                    type: PsyanimArriveAgent,
                    id: 33,
                    params: {
                        arriveBehavior: {
                            entityName: 'fsmTest',
                            componentType: PsyanimArriveBehavior
                        },
                        vehicle: {
                            entityName: 'fsmTest',
                            componentId: 22
                        }
                    }
                },
                {
                    type: PsyanimPathFollowingAgent,
                    params: {
                        currentPathVertices: [
                            new Phaser.Math.Vector2(100, 100),
                            new Phaser.Math.Vector2(700, 100),
                            new Phaser.Math.Vector2(700, 500),
                            new Phaser.Math.Vector2(100, 500)
                        ],
                        arriveAgent: {
                            entityName: 'fsmTest',
                            componentId: 33,
                            // componentType: PsyanimArriveAgent
                        },
                        targetPositionOffset: 50
                    }
                }
            ]
        }
    ]
}