import PsyanimFSMState from '../../../src/core/components/ai/PsyanimFSMState.js';
import PsyanimFleeAgent from "../../../src/core/components/steering/agents/PsyanimFleeAgent.js";
import PsyanimPathFollowingAgent from "../../../src/core/components/steering/agents/PsyanimPathFollowingAgent.js";

import MyMoveToItemState from './MyMoveToItemState.js';

export default class MyPatrolState extends PsyanimFSMState {

    target;

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

        this.entity.color = 0x00ff00;

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

        this.entity.color = 0x00ff00;
    }

    run(t, dt) {

        super.run();

        let item = this.entity.scene.getEntityByName('item');

        if (item)
        {
            this.fsm.setStateVariable('itemInScene', true);
        }
        else
        {
            // TODO: you shouldn't have to set this each time... can't we just do this in onResume()?
            this.fsm.setStateVariable('itemInScene', false);
        }
    }
}