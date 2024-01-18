import PsyanimFSMState from '../../../src/core/components/ai/PsyanimFSMState.js';
import PsyanimFleeBehavior from "../../../src/core/components/steering/PsyanimFleeBehavior.js";
import PsyanimFleeAgent from "../../../src/core/components/steering/agents/PsyanimFleeAgent.js";

import MyIdleState from "./MyIdleState.js";

export default class MyFleeState extends PsyanimFSMState {

    safetyDistance;

    constructor(fsm) {

        super(fsm);

        this.safetyDistance = 50;

        /**
         *  Setup transitions here
         */

        this.addTransition(MyIdleState, 'flee', (value) => value == 0);
    }

    enter() {

        super.enter();

        this._fleeBehavior = this.entity.getComponent(PsyanimFleeBehavior);
        this._fleeAgent = this.entity.getComponent(PsyanimFleeAgent);

        this._target = this._fleeAgent.target;

        this._fleeAgent.enabled = true;
    }

    exit() {

        super.exit();

        this._fleeAgent.enabled = false;
    }

    run(t, dt) {

        super.run();

        let distanceToTarget = this.entity.position.subtract(this._target.position).length();
        let transitionDistance = this._fleeBehavior.panicDistance + this.safetyDistance;
        
        if (distanceToTarget > transitionDistance)
        {
            this.fsm.setStateVariable('flee', 0);
        }
    }
}