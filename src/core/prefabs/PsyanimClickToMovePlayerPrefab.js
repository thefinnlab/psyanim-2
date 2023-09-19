import PsyanimEntityPrefab from "../PsyanimEntityPrefab";

import PsyanimPathfindingAgent from "../components/pathfinding/PsyanimPathfindingAgent";
import PsyanimPathfindingRenderer from "../components/rendering/PsyanimPathfindingRenderer";
import PsyanimVehicle from "../components/steering/PsyanimVehicle";

import PsyanimArriveBehavior from "../components/steering/PsyanimArriveBehavior";
import PsyanimArriveAgent from "../components/steering/agents/PsyanimArriveAgent";
import PsyanimClickToMove from "../components/controllers/PsyanimClickToMove";
import PsyanimPlayerController from "../components/controllers/PsyanimPlayerController";

export default class PsyanimClickToMovePlayerPrefab extends PsyanimEntityPrefab {

    grid;

    maxSpeed;
    innerDecelerationRadius;
    outerDecelerationRadius;

    debug;

    constructor(shapeParams, matterOptions = {}) {

        super(shapeParams, matterOptions);

        this.maxSpeed = 8;
        this.innerDecelerationRadius = 10;
        this.outerDecelerationRadius = 50;

        this.debug = false;
    }

    create(entity) {

        super.create(entity);

        // setup pathfinder
        let pathfinder = entity.addComponent(PsyanimPathfindingAgent);
        pathfinder.grid = this.grid;
        pathfinder.setDestination(entity.position);

        // setup path following
        let vehicle = entity.addComponent(PsyanimVehicle);

        let arriveBehavior = entity.addComponent(PsyanimArriveBehavior);
        arriveBehavior.maxSpeed = this.maxSpeed;
        arriveBehavior.innerDecelerationRadius = this.innerDecelerationRadius;
        arriveBehavior.outerDecelerationRadius = this.outerDecelerationRadius;

        let arriveAgent = entity.addComponent(PsyanimArriveAgent);
        arriveAgent.arriveBehavior = arriveBehavior;
        arriveAgent.vehicle = vehicle;

        let clickToMoveController = entity.addComponent(PsyanimClickToMove);
        clickToMoveController.grid = this.grid;
        clickToMoveController.pathfinder = pathfinder;
        clickToMoveController.arriveAgent = arriveAgent;

        let playerController = entity.addComponent(PsyanimPlayerController);
        playerController.clickToMoveController = clickToMoveController;

        if (this.debug)
        {
            // setup path renderer
            let pathfindingRenderer = entity.addComponent(PsyanimPathfindingRenderer);
            pathfindingRenderer.pathfinder = pathfinder;
            pathfindingRenderer.setGridVisible(true);
            pathfindingRenderer.radius = 4;
        }

        return entity;
    }
}