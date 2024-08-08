import PsyanimComponent from "../../../../PsyanimComponent.js";

import PsyanimBehaviorTreeBlackboard from "../PsyanimBehaviorTreeBlackboard.js";

export default class PsyanimBlackboardTargetDistance extends PsyanimComponent {

    target;

    constructor(entity) {

        super(entity);
    }

    afterCreate() {

        super.afterCreate();

        this._blackboard = this.entity.getComponent(PsyanimBehaviorTreeBlackboard);

        this._blackboard.events.on('created', this._updateTargetDistance.bind(this));
    }

    _updateTargetDistance() {

        let targetDistance = this.entity.position
            .subtract(this.target.position)
            .length();

        this._blackboard.setValue('distanceToTarget', targetDistance);
    }

    update(t, dt) {

        super.update(t, dt);

        this._updateTargetDistance();
    }
}