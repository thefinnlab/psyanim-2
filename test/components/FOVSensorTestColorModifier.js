import PsyanimComponent from "../../src/core/PsyanimComponent";

export default class FOVSensorTestColorModifier extends PsyanimComponent {

    fovSensor;

    constructor(entity) {

        super(entity);
    }

    update(t, dt) {

        super.update(t, dt);

        let entitiesInSight = this.fovSensor.getEntitiesInSight([this.entity]);

        if (entitiesInSight.length != 0)
        {
            if (entitiesInSight.includes(this.entity))
            {
                entitiesInSight[0].setTint(0x00ff00);
            }
            else
            {
                this.entity.setTint(0xffffff);
            }
        }
        else
        {
            this.entity.setTint(0xffffff);
        }
    }
}