import PsyanimComponent from "../../../PsyanimComponent.js";

export default class PsyanimBehaviorTreeBlackboard extends PsyanimComponent {

    name;
    file;

    get events() {

        return this._events;
    }

    get keys() {

        return Object.keys(this._data);
    }

    constructor(entity) {

        super(entity);

        this.file = {};
        this._data = {};

        this._events = new Phaser.Events.EventEmitter();
    }

    afterCreate() {

        super.afterCreate();

        // add all data from the blackboard file
        Object.keys(this.file).forEach(key => {

            this.setValue(key, this.file[key]);
        });

        // add all user-defined params from the scene definition
        let userDefinedParams = this._getUserDefinedParams();

        Object.keys(userDefinedParams).forEach(key => {

            this.setValue(key, userDefinedParams[key]);
        });

        console.log('Blackboard loaded:', this._data);

        if (!this.name)
        {
            console.error("Blackboard was not assigned a name in scene! entity name:", this.entity.name);
        }

        this._events.emit('created');
    }

    _getUserDefinedParams() {

        let reservedKeywords = ['name', 'entity', 'scene', 'id', 'file'];

        let keys = Object.keys(this)
            .filter(key => !key.startsWith('_'))
            .filter(key => !reservedKeywords.includes(key));

        let params = {};

        keys.forEach(key => {
            params[key] = this[key];
        });

        return params;
    }

    getValue(key) {

        if (!Object.hasOwn(this._data, key))
        {
            console.error('Key does not exist:', key);
            return null;
        }

        return this._data[key];
    }

    setValue(key, value) {

        // TODO: this should throw an event!

        this._data[key] = value;
    }

    hasKey(key) {

        return Object.hasOwn(this._data, key);
    }

    toJson() {

        return JSON.stringify({
            name: this.name,
            data: this._data
        });
    }

    loadJson(jsonData) {

        // TODO: implement
        let data = JSON.parse(jsonData);

        if (!Object.hasOwn(data, 'name') ||
            !Object.hasOwn(data, 'data'))
        {
            console.error('Invalid blackboard json:', jsonData);
            return null;
        }

        this._data = data.data;
    }
}