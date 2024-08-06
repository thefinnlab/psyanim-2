import {PsyanimBehaviorTreeTaskDefinition} from 'psyanim-utils';
import MyCustomEnum from './MyCustomEnum.js';

export default class MyTask extends PsyanimBehaviorTreeTaskDefinition {

    // very important that we initialize these fields, so their types are made known to behavior designer!
    stringField = 'hello world';

    numberField = 42;

    boolField = false;

    enumField = new MyCustomEnum(['option A', 'option B', 'option C'], 'option B');

    constructor(controller = null) {

        super(controller);
    }

    _doSomething() {

    }

    _doSomething2() {

    }

    tick() {

    }
}