import PsyanimScene from "../../src/core/scene/PsyanimScene";

export default class EmptyScene extends PsyanimScene {

    static KEY = 'Empty Scene';

    constructor() {

        super(EmptyScene.KEY);
    }
}