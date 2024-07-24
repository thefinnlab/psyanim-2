import PsyanimBehaviorTreeTaskDefinition from './PsyanimBehaviorTreeTaskDefinition.js';
import MyCustomEnum from './MyCustomEnum.js';

export default class MyTask extends PsyanimBehaviorTreeTaskDefinition {

    // very important that we initialize these fields, so their types are made known to behavior designer!
    stringField = '';

    numberField = -1;

    boolField = false;

    enumField = new MyCustomEnum(['option A', 'option B', 'option C']);

    constructor(controller) {

        super(controller);
    }

    _doSomething() {

    }

    _doSomething2() {

    }

    tick() {

    }
}