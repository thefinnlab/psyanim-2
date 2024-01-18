import PsyanimFSM from "../../../src/core/components/ai/PsyanimFSM.js";

import PsyanimSensor from "../../../src/core/components/physics/PsyanimSensor.js";

import MyMoveToItemState from "./MyMoveToItemState.js";

export default class MyCollectItemFSM extends PsyanimFSM {

    constructor(entity) {

        super(entity);

        this._moveToItemState = this.addState(MyMoveToItemState);

        this.initialState = this._moveToItemState;
    }

    afterCreate() {

        super.afterCreate();

        this._sensor = this.entity.getComponent(PsyanimSensor);

        this._sensor.events.on('triggerEnter', (gameObject) => {

            if (gameObject.name === 'item')
            {
                this.scene.destroyEntityByName(gameObject.name);

                console.log('collected item!');
            }
        });

        this.stop();
    }

    update(t, dt) {

        super.update(t, dt);
    }
}