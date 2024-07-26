export default class PsyanimBehaviorTreeTaskDefinition {

    get blackboard() {

        return this._controller.blackboard;
    }

    constructor(controller) {

        this._controller = controller;
    }

    tick() {

    }
}