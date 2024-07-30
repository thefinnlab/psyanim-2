import PsyanimComponent from "../../../PsyanimComponent.js";

export default class PsyanimBehaviorTreeBlackboard extends PsyanimComponent {

    name;

    constructor(entity) {

        super(entity);

        this._data = {};
    }

    afterCreate() {

        super.afterCreate();

        let userDefinedParams = this._getUserDefinedParams();

        Object.keys(userDefinedParams).forEach(key => {

            this.setValue(key, userDefinedParams[key]);
        });

        if (!this.name)
        {
            console.error("Blackboard was not assigned a name in scene! entity name:", this.entity.name);
        }
    }

    _getUserDefinedParams() {

        let reservedKeywords = ['name', 'entity', 'scene', 'id'];

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