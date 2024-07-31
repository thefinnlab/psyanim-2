import PsyanimBehaviorTreeNode from './PsyanimBehaviorTreeNode.js';

export default class PsyanimBehaviorTreeTask extends PsyanimBehaviorTreeNode {

    constructor(controller, id, name, taskDefinition) {

        super(controller, id, name);

        this._taskDefinition = taskDefinition;

        this._decoratorDefinitions = [];
    }

    get childCount() {

        return 0;
    }

    addDecoratorDefinition(decoratorDefinition) {

        this._decoratorDefinitions.push(decoratorDefinition);
    }

    tick() {

        super.tick();

        // TODO: we need to tick the decorators too!

        let status = this._taskDefinition.tick();

        this.validateTaskStatus(status);

        this._status = status;

        return this._status;
    }
}