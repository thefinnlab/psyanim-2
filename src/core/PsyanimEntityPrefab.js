

export default class PsyanimEntityPrefab {

    shapeParams;
    matterOptions;

    constructor(shapeParams = { isEmpty: true }, matterOptions = {}) {

        this.shapeParams = shapeParams;
        this.matterOptions = matterOptions;
    }

    create(entity) {

        return entity;
    }
}