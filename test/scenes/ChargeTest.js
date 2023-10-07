import PsyanimScene from '../../src/core/PsyanimScene.js';
import PsyanimConstants from '../../src/core/PsyanimConstants.js';
import PsyanimVehicle from '../../src/core/components/steering/PsyanimVehicle.js';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController.js';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController.js';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle.js';

import PsyanimChargeBehavior from '../../src/core/components/steering/PsyanimChargeBehavior.js';
import PsyanimChargeAgent from '../../src/core/components/steering/agents/PsyanimChargeAgent.js';

export default class ChargeTest extends PsyanimScene {

    static KEY = 'Charge Test';

    constructor() {

        super(ChargeTest.KEY);
    }

    create() {

        super.create();

        // setup scene controls
        this.addEntity('sceneControls')
            .addComponent(PsyanimSceneTitle).entity
            .addComponent(PsyanimPhysicsSettingsController).entity
            .addComponent(PsyanimSceneChangeController);

        this.target = this.addEntity('target', 750, 550, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 4, color: 0x0000ff
        },
        {
            isSensor: true,
            isSleeping: true
        });

        this.agent1 = this.addEntity('agent1', 50, 50, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
            base: 12, altitude: 20, color: 0x00ff00
        });

        this.agent1.body.friction = 0;
        this.agent1.body.frictionAir = 0;
        this.agent1.body.frictionStatic = 0;

        let vehicle1 = this.agent1.addComponent(PsyanimVehicle);

        // leave the max speed unconstrained (large value)
        vehicle1.maxSpeed = 100;

        vehicle1.useAcceleration = true;

        let chargeBehavior = this.agent1.addComponent(PsyanimChargeBehavior);

        chargeBehavior.chargeDuration = 1.2;
        chargeBehavior.innerDecelerationRadius = 10;
        chargeBehavior.outerDecelerationRadius = 300;

        let chargeAgent = this.agent1.addComponent(PsyanimChargeAgent);

        chargeAgent.vehicle = vehicle1;
        chargeAgent.chargeBehavior = chargeBehavior;

        chargeAgent.setTarget(this.target);

        this._timer = 0;
        this._running = true;
    }

    update(t, dt) {

        super.update(t, dt);

        this._timer += dt;

        if (this._running)
        {
            // check end condition
            let distanceToTarget = this.target.position
                .subtract(this.agent1.position)
                .length();

            if (distanceToTarget < 20)
            {
                console.log("reached target in " + (this._timer / 1000) + " seconds!");

                this._running = false;    
            }
        }
    }
}