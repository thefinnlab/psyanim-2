import PsyanimFSM from "../../../src/core/components/ai/PsyanimFSM.js";

import MyMoveToItemState from "./MyMoveToItemState.js";

export default class MyCollectItemFSM extends PsyanimFSM {

    constructor(entity) {

        super(entity);

        this._moveToItemState = this.addState(MyMoveToItemState);

        this.initialState = this._moveToItemState;
    }

    afterCreate() {

        super.afterCreate();

        this.stop();
    }

    update(t, dt) {

        super.update(t, dt);
    }
}