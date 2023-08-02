import PsyanimComponent from "../../PsyanimComponent";

PsyanimBasicPreyBehavior.STATE = {
    WANDERING: 0x0001,
    FLEEING: 0x0002,
}; 

export default class PsyanimBasicPreyBehavior extends PsyanimComponent {

    subtletly; // 'degrees'
    subtletlyLag; // ms

    fovSensor;

    fleeBehavior;
    wanderBehavior;

    constructor(entity) {

        super(entity);

        this.subtletly = 30; // 'degrees'
        this.subtletlyLag = 500; // ms    

        this._state = PsyanimBasicPreyBehavior.STATE.WANDERING;

        this._fleeTarget = this.scene.addEntity(this.name + '_fleeTarget');

        this._subtletyAngle = 0;
        this._subtletyUpdateTimer = 0;
    }

    get maxSpeed() {

        switch(this._state) {

            case PsyanimBasicPreyBehavior.STATE.WANDERING:

                return this.wanderBehavior.seekBehavior.maxSpeed;

            case PsyanimBasicPreyBehavior.STATE.FLEEING:

                return this.fleeBehavior.maxSpeed;

            default:

            console.error("ERROR: invalid state: " + this._state);
            return 0;
        }
    }

    getSteering(target) {

        // determine if target is in sight
        let targetInSight = false;

        let entitiesInSight = this.fovSensor.getEntitiesInSight([target]);

        if (entitiesInSight.length != 0)
        {
            if (entitiesInSight.includes(target))
            {
                targetInSight = true;
            }
        }

        // update state
        if (targetInSight)
        {
            this._state = PsyanimBasicPreyBehavior.STATE.FLEEING;
        }
        else
        {
            this._state = PsyanimBasicPreyBehavior.STATE.WANDERING;
        }

        // compute steering
        if (this._state == PsyanimBasicPreyBehavior.STATE.FLEEING)
        {
            let targetRelativePosition = target.position
                .subtract(this.entity.position);

            targetRelativePosition.rotate(this._subtletyAngle * Math.PI / 180.0);

            let newTargetPosition = this.entity.position
                .add(targetRelativePosition);

            this._fleeTarget.position = newTargetPosition;

            return this.fleeBehavior.getSteering(this._fleeTarget);
        }
        else if (this._state == PsyanimBasicPreyBehavior.STATE.WANDERING)
        {
            return this.wanderBehavior.getSteering();
        }
    }

    update(t, dt) {

        super.update(t, dt);

        this._subtletyUpdateTimer += dt;

        if (this._subtletyUpdateTimer > this.subtletyLag)
        {
            this._subtletyUpdateTimer = 0;

            if (this._state == PsyanimBasicPreyBehavior.STATE.PURSUING)
            {
                // recompute subtlety angle
                this._subtletyAngle = this.subtlety * (2 * Math.random() - 1);
            }
        }        
    }
}