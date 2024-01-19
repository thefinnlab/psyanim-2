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

        this.entity.color = 0x00ff00;

        this._target = this._fleeAgent.target;

        this._pathFollowingAgent.enabled = true;
    }

    exit() {

        super.exit();

        this._pathFollowingAgent.enabled = false;

        this.entity.setVelocity(0, 0);
    }

    onResume() {

        super.onResume();

        this._pathFollowingAgent.enabled = true;
        this._pathFollowingAgent.setupArriveAgent();
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