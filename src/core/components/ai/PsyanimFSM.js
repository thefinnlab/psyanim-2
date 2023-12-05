import PsyanimComponent from '../../PsyanimComponent.js';

export default class PsyanimFSM extends PsyanimComponent {

    initialState;

    debug;

    constructor(entity) {

        super(entity);

        // TODO: this should probably be 'false' by default, but you need to update the tutorial if so
        this.debug = true;

        this._stateVariables = {};
        this._states = [];

        this._initialized = false;
    }

    stringifyStateVariables() {

        return JSON.stringify(this._stateVariables, null, 4);
    }

    getState(stateType) {

        return this._states.find(state => state instanceof stateType);
    }

    hasState(stateType) {

        if (this.getState(stateType))
        {
            return true;
        }

        return false;
    }

    addState(stateType) {

        if (this.hasState(stateType))
        {
            console.error('state type already exists on this FSM: ', stateType.constructor.name);
            return;
        }

        let newState = new stateType(this);

        this._states.push(newState);

        return newState;
    }

    afterCreate() {

        this._currentState = this.initialState;

        console.log('initialState: ', this.initialState);

        super.afterCreate();
    }

    stateVariableExists(key) {

        return Object.hasOwn(this._stateVariables, key);
    }

    setStateVariable(key, value) {

        this._stateVariables[key] = value;
    }

    getStateVariable(key) {

        return this._stateVariables[key];
    }

    update(t, dt) {

        super.update(t, dt);

        // we don't enter the 'initialState' until the first update() runs
        if (!this._initialized)
        {
            this._currentState.enter();
            this._initialized = true;
        }

        // see if we have any transition conditions met
        let currentTransition = null;

        for (let i = 0; i < this._currentState.transitions.length; ++i)
        {
            let t = this._currentState.transitions[i];

            if (t.isTriggered)
            {
                currentTransition = t;
                break;
            }
        }

        // if a transition is triggered, switch states
        if (currentTransition)
        {
            this._currentState.exit();

            // TODO: maybe we should wire this stuff up ahead of time in the base state class's
            // enter() method so we don't have to do a getState() in our main loop here
            let targetState = this.getState(currentTransition.targetStateType);

            targetState.enter();

            this._currentState = targetState;
        }

        // let the current state run
        this._currentState.run(t, dt);
    }
}