import PsyanimFSMState from '../../../src/core/components/ai/PsyanimFSMState.js';
import PsyanimFleeBehavior from "../../../src/core/components/steering/PsyanimFleeBehavior.js";
import PsyanimFleeAgent from "../../../src/core/components/steering/agents/PsyanimFleeAgent.js";
import PsyanimPathFollowingAgent from "../../../src/core/components/steering/agents/PsyanimPathFollowingAgent.js";

import MyFleeState from './MyFleeState.js';

export default class MyPatrolState extends PsyanimFSMState {

    constructor(fsm) {

        super(fsm);

        /**
         *  Setup transitions here
         */

        this.addTransition(MyFleeState, 'flee', (value) => value == 1);
    }

    enter() {

        super.enter();

        this._fleeBehavior = this.entity.getComponent(PsyanimFleeBehavior);
        this._fleeAgent = this.entity.getComponent(PsyanimFleeAgent);

        this._target = this._fleeAgent.target;

        this._pathFollowingBehavior = this.entity.getComponent(PsyanimPathFollowingAgent);

        this._pathFollowingBehavior.enabled = true;
    }

    exit() {

        super.exit();

        this._pathFollowingBehavior.enabled = false;

        this.entity.setVelocity(0, 0);
    }

    run(t, dt) {

        super.run();

        let distanceToTarget = this.entity.position.subtract(this._target.position).length();

        if (distanceToTarget < this._fleeBehavior.panicDistance)
        {
            this.fsm.setStateVariable('flee', 1);
        }
    }
}