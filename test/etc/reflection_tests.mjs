class MyClassA {

    static STATE = {
        IDLE: 0x0001,
        RUNNING: 0x0002,
        PAUSED: 0x0003
    };

    x = 2;
    y = 3;
    z = 4;

    constructor() {
    }

    doSomething() {
        console.log("doSomething called");
    }
}

const getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] === value);
}

const getStateKeyAsString = (type, state) => {
    return getKeyByValue(type.STATE, state);
}

const printObjectState = (state) => {
    console.log("state = " + getStateKeyAsString(MyClassA, state));
}

console.log("class we're working with: " + MyClassA.name);

let state = MyClassA.STATE.IDLE;

printObjectState(state);

state = MyClassA.STATE.RUNNING;

printObjectState(state);

state = MyClassA.STATE.PAUSED;

printObjectState(state);