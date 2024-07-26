export default class PsyanimEnum {

    get options() {

        return this._options.slice();
    }

    get value() {

        return this._value;
    }

    constructor(options = []) {

        this._options = [];

        options.forEach(opt => this.addOption(opt));

        if (this._options.length === 0)
        {
            console.error("ERROR: enum has no options!");
        }

        this._value = 0;
    }

    addOption(name) {

        if (!this._options.includes(name))
        {
            this._options.push(name);
        }
    }

    setValue(value) {

        if (this._options.includes(value))
        {
            this._value = this._options.indexOf(value);
        }
        else
        {
            console.error("Unknown enum value:", value);
        }
    }
}