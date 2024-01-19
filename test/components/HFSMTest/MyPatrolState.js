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

    afterCreate() {

        super.afterCreate();

        this._fleeBehavior = this.entity.getComponent(PsyanimFleeBehavior);
        this._fleeAgent = this.entity.getComponent(PsyanimFleeAgent);

        this._pathFollowingAgent = this.entity.getComponent(PsyanimPathFollowingAgent);
    }

    enter() {

        super.enter();

        this._target = this._fleeAgent.target;

        this._pathFollowingAgent.enabled = true;
    }

    exit() {

        super.exit();

        this._pathFollowingAgent.enabled = false;

        this.entity.setVelocity(0, 0);
    }

    run(t, dt) {

        super.run();

        // TODO: OK, this is a fundamental flaw you need to fix, which is that, if the other 
        // FSMs that run in the HFSM happen to enable / disable certain components, 
        // this FSM needs to make sure they are re-enabled and reconfigured...  not good!

        if (!this._pathFollowingAgent.enabled)
        {
            this._pathFollowingAgent.enabled = true;
        }

        if (!this._pathFollowingAgent.arriveAgent.enabled)
        {
            this._pathFollowingAgent.arriveAgent.enabled = true;
            this._pathFollowingAgent.arriveAgent.target = this._pathFollowingAgent._pathFollowingTarget;
        }

        let distanceToTarget = this.entity.position.subtract(this._target.position).length();

        if (distanceToTarget < this._fleeBehavior.panicDistance)
        {
            this.fsm.setStateVariable('flee', 1);
        }
    }
}