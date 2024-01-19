import PsyanimFSMState from '../../../src/core/components/ai/PsyanimFSMState.js';

import PsyanimSensor from '../../../src/core/components/physics/PsyanimSensor.js';

import PsyanimArriveAgent from '../../../src/core/components/steering/agents/PsyanimArriveAgent.js';

export default class MyMoveToItemState extends PsyanimFSMState {

    constructor(fsm) {

        super(fsm);

        this.fsm.setStateVariable('itemCollected', false);
    }

    afterCreate() {

        super.afterCreate();

        this._arriveAgent = this.entity.getComponent(PsyanimArriveAgent);

        this._sensor = this.entity.getComponent(PsyanimSensor);

        this._sensor.events.on('triggerEnter', (gameObject) => {

            if (gameObject.name === 'item')
            {
                this._arriveAgent.enabled = false;
                this._arriveAgent.target = null;

                this.entity.scene.destroyEntityByName(gameObject.name);

                this.fsm.setStateVariable('itemCollected', true);

                console.log('collected item!');
            }
        });
    }

    enter() {

        super.enter();

        this.fsm.setStateVariable('itemCollected', false);

        let item = this.entity.scene.getEntityByName('item');

        if (!item)
        {
            console.error("ERROR: no item found in scene!");
        }

        this._arriveAgent.enabled = true;
        this._arriveAgent.target = item;
    }

    exit() {

        super.exit();

        this._arriveAgent.enabled = false;
    }

    run(t, dt) {

        super.run(t, dt);
    }
}