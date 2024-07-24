import PsyanimBehaviorTreeNode from './PsyanimBehaviorTreeNode.js';

export default class PsyanimBehaviorTreeTask extends PsyanimBehaviorTreeNode {

    constructor(name, taskDefinition = null) {

        super(name);

        this._taskDefinition = taskDefinition;
        this._decoratorDefinitions = [];
    }

    get children() {

        return null;
    }

    get childCount() {

        return 0;
    }

    addDecoratorDefinition(decoratorDefinition) {

        this._decoratorDefinitions.push(decoratorDefinition);
    }

    tick() {

        super.tick();

        if (this._taskDefinition)
        {
            let status = this._taskDefinition.tick();

            this.validateTaskStatus(status);

            this._status = status;
        }
        else
        {
            this._status = PsyanimBehaviorTreeNode.STATUS.FAILURE;
        }

        return this._status;
    }
}