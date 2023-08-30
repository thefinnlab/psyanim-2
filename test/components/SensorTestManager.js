import PsyanimComponent from "../../src/core/PsyanimComponent";

export default class SensorTestManager extends PsyanimComponent {

    sensor;

    constructor(entity) {

        super(entity);
    }

    afterCreate() {

        super.afterCreate();

        this.sensor.events.on('triggerEnter', (entity) => {
            console.log(entity.name + ' has ENTERED the building...');
        });

        this.sensor.events.on('triggerExit', (entity) => {
            console.log(entity.name + ' has EXITED the building...');
        });
    }
}