import Phaser from 'phaser';

import PsyanimScene from "../../core/scene/PsyanimScene";

import PsyanimConstants from '../../core/PsyanimConstants';

import PsyanimVehicle from '../../core/components/steering/PsyanimVehicle';
import PsyanimWanderBehavior from '../../core/components/steering/PsyanimWanderBehavior';
import PsyanimPlayfightBehavior from '../../core/components/steering/PsyanimPlayfightBehavior';

export default class PsyanimPlayfightTest extends PsyanimScene {

    constructor() {

        super('Playfight Test');
    }

    create() {

        super.create();

        let circleAgentRadius = 12;
        let outerDecelerationRadius = 30;
        let panicDistance = 30;

        // setup wander agent 1
        let wanderAgent1 = this.addEntity('wanderAgent1', 500, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
            base: 16, altitude: 32, radius: circleAgentRadius, color: 0xff0000         
        });

        let wanderTarget1 = this.addEntity('wanderTarget1', 0, 0, { isEmpty: true });

        this.wanderVehicle1 = wanderAgent1.addComponent(PsyanimVehicle);
        this.wanderVehicle1.target = wanderTarget1;
        this.wanderVehicle1.setState(PsyanimVehicle.STATE.SEEK);

        this.wanderVehicle1.innerDecelerationRadius = circleAgentRadius;
        this.wanderVehicle1.outerDecelerationRadius = outerDecelerationRadius;
        this.wanderVehicle1.panicDistance = panicDistance;

        this.wander1 = wanderAgent1.addComponent(PsyanimWanderBehavior);
        this.wander1.vehicle = this.wanderVehicle1;
        this.wander1.target = wanderTarget1;

        this.playfight1 = wanderAgent1.addComponent(PsyanimPlayfightBehavior);
        this.playfight1.vehicle = this.wanderVehicle1;
        this.playfight1.wander = this.wander1;

        // setup wander agent 2
        let wanderAgent2 = this.addEntity('wanderAgent2', 300, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
            base: 16, altitude: 32, radius: circleAgentRadius, color: 0x0000ff         
        });

        let wanderTarget2 = this.addEntity('wanderTarget2', 0, 0, { isEmpty: true });

        this.wanderVehicle2 = wanderAgent2.addComponent(PsyanimVehicle);
        this.wanderVehicle2.target = wanderTarget2;
        this.wanderVehicle2.setState(PsyanimVehicle.STATE.SEEK);

        this.wanderVehicle2.innerDecelerationRadius = circleAgentRadius;
        this.wanderVehicle2.outerDecelerationRadius = outerDecelerationRadius;
        this.wanderVehicle2.panicDistance = panicDistance;

        this.wander2 = wanderAgent2.addComponent(PsyanimWanderBehavior);
        this.wander2.vehicle = this.wanderVehicle2;
        this.wander2.target = wanderTarget2;

        this.playfight2 = wanderAgent2.addComponent(PsyanimPlayfightBehavior);
        this.playfight2.vehicle = this.wanderVehicle2;
        this.playfight2.wander = this.wander2;

        // setup charge targets for each playfight component
        this.playfight1.setChargeTarget(wanderAgent2);
        this.playfight2.setChargeTarget(wanderAgent1);

        // setup inputs
        this._testKeys = {
            C: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C),
            V: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V),
            ZERO: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO),
        }

        // TODO: for the screen boundary wrapping to look good, 
        // we need the wander behavior to avoid the screen boundaries...
        this.screenBoundary.wrap = false;
    }

    update(t, dt) {

        super.update(t, dt);

        if (Phaser.Input.Keyboard.JustDown(this._testKeys.ZERO))
        {
            this.wander.enabled = !this.wander.enabled;
            this.wanderVehicle.enabled = !this.wanderVehicle.enabled;
        }
        else if (Phaser.Input.Keyboard.JustDown(this._testKeys.C))
        {
            this.playfight.setState(PsyanimPlayfight.STATE.CHARGING);
        }
        else if (Phaser.Input.Keyboard.JustDown(this._testKeys.V))
        {
            this.playfight.setState(PsyanimPlayfight.STATE.WANDERING);
        }
    }
}