import PsyanimFSMState from '../../../src/core/components/ai/PsyanimFSMState.js';
import PsyanimFleeAgent from "../../../src/core/components/steering/agents/PsyanimFleeAgent.js";

import MyIdleState from "./MyIdleState.js";

export default class MyFleeState extends PsyanimFSMState {

    panicDistance;
    safetyDistance;

    constructor(fsm) {

        super(fsm);

        this.safetyDistance = 50;
        this.panicDistance = 150;

        this._minDistanceForTransition = this.panicDistance + this.safetyDistance;

        /**
         *  Setup transitions here
         */

        this.addTransition(MyIdleState, 'distanceToTarget', (value) => value > this._minDistanceForTransition);
    }

    afterCreate() {

        super.afterCreate();

        this._fleeAgent = this.entity.getComponent(PsyanimFleeAgent);
    }

    enter() {

        super.enter();

        this.entity.color = 0x0000ff;

        this._target = this._fleeAgent.target;

        this._fleeAgent.enabled = true;
    }

    exit() {

        super.exit();

        this._fleeAgent.enabled = false;
    }

    onPause() {

        super.onPause();

        this._fleeAgent.enabled = false;
    }

    onStop() {

        super.onStop();

        if (this._fleeAgent)
        {
            this._fleeAgent.enabled = false;
        }
    }

    onResume() {

        super.onResume();

        if (this._fleeAgent)
        {
            this._fleeAgent.enabled = true;
        }

        this.entity.color = 0x0000ff;
    }

    run(t, dt) {

        super.run();

        let distanceToTarget = this.entity.position.subtract(this._target.position).length();
        
        this.fsm.setStateVariable('distanceToTarget', distanceToTarget);
    }
}