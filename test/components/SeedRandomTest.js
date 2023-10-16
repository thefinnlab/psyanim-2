import PsyanimComponent from "../../src/core/PsyanimComponent.js";

import {
    PsyanimUtils
} from 'psyanim-utils';

export default class SeedRandomTest extends PsyanimComponent {

    constructor(entity) {

        super(entity);

        PsyanimUtils.setRandomSeed('hello');

        let testValues = [];

        for (let i = 0; i < 100; ++i)
        {
            testValues.push(PsyanimUtils.random());
        }

        console.log(testValues);

        testValues = [];

        PsyanimUtils.setRandomSeed('goodbye');

        for (let i = 0; i < 100; ++i)
        {
            testValues.push(PsyanimUtils.random());
        }

        console.log(testValues);
    }

    update(t, dt) {

        super.update(t, dt);
    }
}