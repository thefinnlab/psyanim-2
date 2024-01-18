import PsyanimConstants from "../../../src/core/PsyanimConstants.js";
import PsyanimComponent from "../../../src/core/PsyanimComponent.js";

export default class MyItemSpawner extends PsyanimComponent {

    spawnLocation;

    spawnFrequency; // ms

    constructor(entity) {

        super(entity);

        this.spawnLocation = new Phaser.Math.Vector2(400, 500);

        this.spawnFrequency = 3000;

        this.events = new Phaser.Events.EventEmitter();
    }

    spawnItem() {

        let item = this.scene.addEntity('item', this.spawnLocation.x, this.spawnLocation.y,
            { 
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
                radius: 8,
                color: 0x00ff00
            });

        this.events.emit('newItemSpawned', item);
    }

    afterCreate() {

        super.afterCreate();

        this._spawnTimer = 0;
    }

    update(t, dt) {

        super.update(t, dt);

        let item = this.scene.getEntityByName('item');

        if (!item)
        {
            this._spawnTimer += dt;

            if (this._spawnTimer > this.spawnFrequency)
            {
                this.spawnItem();
    
                this._spawnTimer =  0;
            }
        }
    }
}