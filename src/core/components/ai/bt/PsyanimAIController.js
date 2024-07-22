import Phaser from 'phaser';

import PsyanimComponent from '../../../PsyanimComponent.js';

import { PsyanimDebug } from 'psyanim-utils';

import PsyanimBehaviorTree from 'PsyanimBehaviorTree.js';

export default class PsyanimAIController extends PsyanimComponent {

    behaviorTreeFilePath;

    constructor(entity) {

        super(entity);

        this._tree = null;
    }

    _loadBehaviorTree() {

        // TODO: see if we can import a js object from a json file so we don't have to request it 
        // from the server... should be something that vite does at build time:

        // https://stackoverflow.com/questions/67822238/how-to-import-a-json-file-using-vite-dynamicly

        // this poster says you should be able to simply use a normal import:
        // https://github.com/vitejs/vite/discussions/8242



        // let jsonData = 

        // this._tree = PsyanimBehaviorTree.fromJson(jsonData);

        // TODO: validation
    }

    get tree() {

        return this._tree;
    }

    onEnable() {

        super.onEnable();
    }

    onDisable() {

        super.onDisable();
    }

    afterCreate() {

        super.afterCreate();

        this._loadBehaviorTree();
    }

    beforeShutdown() {

        super.beforeShutdown();
    }

    onSensorEnter(entity) {

        super.onSensorEnter(entity);
    }

    onSensorExit(entity) {

        super.onSensorExit(entity);
    }

    update(t, dt) {
        
        super.update(t, dt);

        this._tree.tick();
    }
}