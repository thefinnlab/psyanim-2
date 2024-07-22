import PsyanimBehaviorTreeNode from './PsyanimBehaviorTreeNode.js';

export default class PsyanimBehaviorTreeTask extends PsyanimBehaviorTreeNode {

    constructor(name) {

        super(name);
    }

    get children() {

        return null;
    }

    get childCount() {

        return 0;
    }

    tick() {

        super.tick();

        
    }
}