import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';

import PsyanimConstants from '../../core/PsyanimConstants';
import PsyanimMouseFollowTarget from '../../core/components/controllers/PsyanimMouseFollowTarget';
import PsyanimVehicle from '../../core/components/steering/PsyanimVehicle';

import PsyanimLineRenderer from '../../core/components/rendering/PsyanimLineRenderer';

export default class AdvancedFleeTest extends PsyanimScene {

    constructor() {

        super('Advanced Flee Test');
    }

    create() {

        super.create();

        // setup mouse follow target
        let mouseTarget = this.addEntity('mouseFollowTarget', 400, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 4,
            color: 0x00ff00
        });

        mouseTarget.addComponent(PsyanimMouseFollowTarget, { radius: 4 });

        // add agents with vehicle components to this scene
        this.agent1 = this.addEntity('agent1', 600, 450, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
            base: 16, altitude: 32, 
            color: 0xffc0cb            
        });

        this.agent2 = this.addEntity('agent2', 200, 150, {
            shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE, 
            width: 60, height: 30,
            color: 0xffff00            
        });

        this.vehicle1 = this.agent1.addComponent(PsyanimVehicle);
        this.vehicle2 = this.agent2.addComponent(PsyanimVehicle);

        this.vehicle1.target = mouseTarget;
        this.vehicle1.setState(PsyanimVehicle.STATE.ADVANCED_FLEE);
        this.vehicle1.maxSpeed = 4;

        this.vehicle2.target = mouseTarget;
        this.vehicle2.setState(PsyanimVehicle.STATE.ADVANCED_FLEE);
        this.vehicle2.maxSpeed = 3;
        this.vehicle2.nSamplesForLookSmoothing = 10;
        this.vehicle2.setAdvancedFleeSearchDirection(false);

        this.lineRenderer1 = this.agent1.addComponent(PsyanimLineRenderer);
        this.lineRenderer2 = this.agent2.addComponent(PsyanimLineRenderer);

        this.screenBoundary.wrap = false;
    }

    update(t, dt) {
        
        super.update(t, dt);

        this.lineRenderer1.originPoint = this.agent1.position;
        this.lineRenderer1.endPoint = this.vehicle1._advancedFleeDirection.clone()
            .add(this.agent1.position);

        this.lineRenderer2.originPoint = this.agent2.position;
        this.lineRenderer2.endPoint = this.vehicle2._advancedFleeDirection.clone()
            .add(this.agent2.position);
    }
}