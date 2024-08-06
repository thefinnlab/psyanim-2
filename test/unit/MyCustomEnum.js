import {PsyanimEnum} from "psyanim-utils";

export default class MyCustomEnum extends PsyanimEnum {

    constructor(options, initialValue = null) {

        super(options);

        if (initialValue)
        {
            this.setValue(initialValue);
        }
    }
}