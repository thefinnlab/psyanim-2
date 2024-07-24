export default class PsyanimBehaviorTreeTaskDefinition {

    get blackboard() {

        return this._blackboard;
    }

    constructor(controller) {

        this._controller = controller;
        this._blackboard = this._controller.blackboard;
    }

    tick() {

    }
}