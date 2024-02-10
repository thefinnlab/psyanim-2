import PsyanimFSMState from '../../../src/core/components/ai/PsyanimFSMState.js';
import PsyanimPathFollowingAgent from "../../../src/core/components/steering/agents/PsyanimPathFollowingAgent.js";

import MyMoveToItemState from './MyMoveToItemState.js';

export default class MyPatrolState extends PsyanimFSMState {

    constructor(fsm) {

        super(fsm);

        /**
         *  Setup transitions here
         */

        this.addTransition(MyMoveToItemState, 'itemInScene', (value) => value === true);
    }

    afterCreate() {

        super.afterCreate();

        this._pathFollowingAgent = this.entity.getComponent(PsyanimPathFollowingAgent);
    }

    enter() {

        super.enter();

        this.fsm.setStateVariable('itemInScene', false);

        this._pathFollowingAgent.enabled = true;
        this._pathFollowingAgent.setupArriveAgent();

        this.entity.color = 0x00ff00;
    }

    exit() {

        super.exit();

        this._pathFollowingAgent.enabled = false;
    }

    onResume() {

        super.onResume();

        this.fsm.setStateVariable('itemInScene', false);

        this._pathFollowingAgent.enabled = true;
        this._pathFollowingAgent.setupArriveAgent();

        this.entity.color = 0x00ff00;
    }

    onPause() {

        super.onPause();

        this._pathFollowingAgent.enabled = false;
    }

    run(t, dt) {

        super.run();

        let item = this.entity.scene.getEntityByName('item');

        if (item)
        {
            this.fsm.setStateVariable('itemInScene', true);
        }
    }
}