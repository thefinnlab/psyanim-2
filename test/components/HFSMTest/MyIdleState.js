import PsyanimFSMState from '../../../src/core/components/ai/PsyanimFSMState.js';
import PsyanimFleeBehavior from "../../../src/core/components/steering/PsyanimFleeBehavior.js";
import PsyanimFleeAgent from "../../../src/core/components/steering/agents/PsyanimFleeAgent.js";

import MyFleeState from './MyFleeState.js';
import MyPatrolState from './MyPatrolState.js';

export default class MyIdleState extends PsyanimFSMState {

    returnToPatrolTime;

    constructor(fsm) {
    
        super(fsm);
    
        this.returnToPatrolTime = 1500;

        this.fsm.setStateVariable('idleTimer', 0);
    
        /**
         *  Setup transitions here
         */
    
        this.addTransition(MyFleeState, 'flee', (value) => value == 1);
        this.addTransition(MyPatrolState, 'idleTimer', (value) => value > this.returnToPatrolTime);
    }
    
    afterCreate() {

        super.afterCreate();

        this._fleeBehavior = this.entity.getComponent(PsyanimFleeBehavior);
        this._fleeAgent = this.entity.getComponent(PsyanimFleeAgent);
    }

    onResume() {

        super.onResume();

        this.entity.color = 0xffff00;
    }

    enter() {
    
        super.enter();

        this.entity.color = 0xffff00;

        this.fsm.setStateVariable('idleTimer', 0);
    
        this._target = this._fleeAgent.target;
    }

    exit() {

        super.exit();
    }

    run(t, dt) {

        super.run();

        // update timer
        let timer = this.fsm.getStateVariable('idleTimer');

        this.fsm.setStateVariable('idleTimer', timer + dt);

        // check if we need to flee
        let distanceToTarget = this.entity.position.subtract(this._target.position).length();

        if (distanceToTarget < this._fleeBehavior.panicDistance)
        {
            this.fsm.setStateVariable('flee', 1);
        }
    }
}