import PsyanimComponent from "../../src/core/PsyanimComponent";

export default class AfterCreateTest extends PsyanimComponent {

    constructor(entity) {

        super(entity);
    }

    afterCreate() {

        super.afterCreate();

        console.log('after update called!');
    }

    update(t, dt) {

        super.update(t, dt);
    }
}