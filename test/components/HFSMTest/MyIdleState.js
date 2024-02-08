import PsyanimFSMState from '../../../src/core/components/ai/PsyanimFSMState.js';

import MyFleeState from './MyFleeState.js';

export default class MyIdleState extends PsyanimFSMState {

    target;
    panicDistance;

    constructor(fsm) {
    
        super(fsm);
    
        this.panicDistance = 150;

        this.fsm.setStateVariable('idleTime', 0);
    
        /**
         *  Setup transitions here
         */
    
        this.addTransition(MyFleeState, 'distanceToTarget', (value) => value < this.panicDistance);
    }
    
    afterCreate() {

        super.afterCreate();
    }

    enter() {
    
        super.enter();

        this.entity.color = 0xffff00;
    }

    exit() {

        super.exit();
    }

    onStop() {

        super.onStop();

        this.fsm.setStateVariable('idleTime', 0);
    }

    run(t, dt) {

        super.run();

        // update timer
        let timer = this.fsm.getStateVariable('idleTime');

        this.fsm.setStateVariable('idleTime', timer + dt);

        // update distance to target
        let distanceToTarget = this.entity.position.subtract(this.target.position).length();

        this.fsm.setStateVariable('distanceToTarget', distanceToTarget);
    }
}