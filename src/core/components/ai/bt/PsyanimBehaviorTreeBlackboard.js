export default class PsyanimBehaviorTreeBlackboard {

    constructor(name) {

        this._name = name;
        this._data = {};
    }

    get name() {

        return this._name;
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
            name: this._name,
            data: this._data
        });
    }

    static fromJson(jsonData) {

        let data = JSON.parse(jsonData);

        if (!Object.hasOwn(data, 'name') ||
            !Object.hasOwn(data, 'data'))
        {
            console.error('Invalid blackboard json:', jsonData);
            return null;
        }

        let blackboard = new PsyanimBehaviorTreeBlackboard(data.name);

        blackboard._data = data.data;

        return blackboard;
    }
}