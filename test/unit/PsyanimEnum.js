export default class PsyanimEnum {

    constructor() {

        this._data = [];
    }

    addOption(name) {

        if (!this._data.includes(name))
        {
            this._data.push(name);
        }
    }

    setValue(value) {

        if (!this._data.includes(value))
        {
            this._value = value;
        }
        else
        {
            console.error("Unknown enum value:", value);
        }
    }

    getValue() {

        return this._value;
    }
}