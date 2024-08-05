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

    reset() {

        super.reset();

        this._taskDefinition.reset();
    }

    tick() {

        let canExecute = this.evaluateDecorators();

        if (!canExecute)
        {
            this._status = PsyanimBehaviorTreeNode.STATUS.FAILURE;

            return this._status;
        }

        let status = this._taskDefinition.tick();

        this.validateTaskStatus(status);

        this._status = status;

        return this._status;
    }
}