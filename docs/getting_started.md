# Getting started with Psyanim 2.0

## 1. Core concepts

Psyanim 2.0 is a framework for creating browser-based psychology / cognitive science research experiments involving 2D procedural animation.

The framework is built on top of [Phaser 3](https://phaser.io/) and has a flexible [component architecture](https://gameprogrammingpatterns.com/component.html).

In Psyanim 2.0, everything that is seen in the world lives in a `PsyanimScene`.

Any object that exists in a scene, regardless of its visual representation, is called an `PsaynimEntity`.

A `PsyanimEntity` is simply a container for `PsyanimComponents`.  

Entities may or may not have a visual representation in the scene.

Moreover, entities alone do not have any logic or behaviors.  While entities have no user-defined state, they do have a position, orientation and velocity in the world, and can have forces / accelerations applied to them.

All user-defined state and behaviors are encapsulated in `PsyanimComponents`, which can be attached to a `PsyanimEntity`.

## 2. Creating our first experiment using the Psyanim CLI

***Pre-requisites: Requires NodeJS v18.16.0 or higher.***

Let's create a simple experiment to get familiar with using Psyanim 2.0.

At any time, you can run `npm ./tools/psyanim_cli.mjs --help` to see the docs for Psyanim CLI.

Follow these steps to create a new project:

**Optional: Install http-server (unless you have your own static file server tool) and refer to [npm](https://www.npmjs.com/package/http-server) docs to host your builds locally**

    npm install --global http-server

**a. Open a terminal, navigate to the root of the Psyanim 2.0 repository and run:**

    npm i

**b. Run the following command to create a 'helloPsyanim' experiment:**
    
    node ./tools/psyanim_cli.mjs helloPsyanim

You should now see the following files created under ./experiments/helloPsyanim:

- `ExperimentDefinition.js`
- `index.html`
- `index.js`

You should also see a webpack config automatically generated for your experiment and package.json updated with a couple commands for building with webpack.

At this stage, we have an experiment with no scenes.  Let's add a scene.

**c. Back in the terminal, run the following command to create a scene named 'MyFirstScene':**

    node .\tools\psyanim_cli.mjs helloPsyanim -s MyFirstScene

You should see `MyFirstScene.js` show up under `./experiments/helloPsyanim`.

Let's see how to add this new scene to our `ExperimentDefinition.js` file.

**d. Open `ExperimentDefinition.js` and add the following import to the top of the file:**

    import MyFirstScene from './MyFirstScene';

**e. Under the 'runs' array property, add the following JSON object:**

    {
        sceneType: MyFirstScene,
        parameterSet: {},
        variations: 1
    }

**f. Open `index.js` and add the following code to the imports at the top:**

    import PsyanimExperimentManager from '../../src/core/components/experiments/PsyanimExperimentManager';

**g. at the bottom of the file to add a keyboard controller using 'enter' key to load the next scene:**

    /**
    *  Setup communication between other DOM scripts and PsyanimApp
    */

    window.psyanimApp = PsyanimApp.Instance;

    window.psyanimApp.currentPlayerID = 'tester1234';

    document.addEventListener('keydown', (event) => {

        if (event.key == 'Enter')
        {
            let experimentManager = PsyanimApp.Instance.currentScene
                .getComponentByType(PsyanimExperimentManager);

            experimentManager.loadNextScene();
        }
    });

**h. Run `npm run helloPsyanim-build` in your terminal and then look in the ./dist directory to see your index.html.  Load this in your browser using whatever static file server you prefer.**

### Congratulations, you've created your first scene!

## 2. Creating our first entity and component using the Psyanim CLI

**a. Back in our terminal, let's create our first component `MyFirstMovementComponent` by running the following command:**

    node .\tools\psyanim_cli.mjs helloPsyanim -c MyFirstMovementComponent

You should see MyFirstMovementComponent.js

**b. Open up `MyFirstScene.js` and add the following code so the imports at the top and your `create` method looks like the following:**

    import Phaser from 'phaser';

    import PsyanimScene from '../../src/core/scene/PsyanimScene';

    import PsyanimExperimentManager from '../../src/core/components/experiments/PsyanimExperimentManager';

    import PsyanimConstants from '../../src/core/PsyanimConstants';
    import PsyanimComponent from '../../src/core/PsyanimComponent';

    import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

    import MyFirstMovementComponent from './MyFirstMovementComponent';

    export default class MyFirstScene extends PsyanimScene {

        static KEY = '___MyFirstScene';

        constructor() {

            super(MyFirstScene.KEY);
        }

        init() {
            
            super.init();
        }

        create() {

            super.create();

            this.addEntity('sceneControls')
                .addComponent(PsyanimSceneTitle);

            this.addEntity('experimentManager')
                .addComponent(PsyanimExperimentManager);

            let agent1 = this.addEntity('agent1', 400, 300, {
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
                radius: 10, 
                color: 0xff0000
            });

            agent1.addComponent(MyFirstMovementComponent);
        }

        update(t, dt) {

            super.update(t, dt);
        }
    }

In the `create` method above, we add 3 entities.  Two the entities, `'sceneControls'` and `'experimentManager'` have no visual representation in the scene.  Hence, there is only 1 parameter supplied to the `addEntity` method of the scene.

The `agent1` entity has a red circle representation in the scene and is centered at pixel coordinates `(400, 300)` in the scene.

Notice we add our `MyFirstMovementComponent` to our `agent1` entity with a simple call to `addComponent`.

**c. Open MyFirstMovementComponent.js and add the following code to have the agent move back and forth horizontally:**

    import Phaser from 'phaser';

    import PsyanimComponent from '../../src/core/PsyanimComponent';

    export default class MyFirstMovementComponent extends PsyanimComponent {

        speed = 0.5;

        constructor(entity) {

            super(entity);
        }

        update(t, dt) {

            let oldPosition = this.entity.position;

            // compute speed
            if (oldPosition.x > 700 && this.speed > 0)
            {
                this.speed *= -1.0;
            }
            else if (oldPosition.x < 100 && this.speed < 0)
            {
                this.speed *= -1.0;
            }

            // compute displacement over 'dt'
            let displacement = new Phaser.Math.Vector2(this.speed * dt, 0);

            // compute new position and set this entity's position to it
            oldPosition.add(displacement);

            this.entity.position = oldPosition;
        }
    }

The `update` method above is called every frame (60 times per second).

Inside the `update` method, we've added code to compute the speed of the entity, then compute it's displacement from it's speed and the `dt` (or 'delta time') parameter supplied to `update`, and then add that displacement to the entity's current position.

Note that using `this.entity` within a component will return a reference to the entity which the component is attached to.

**d. Rebuild your ./dist bundle and reload the page in your browser and you should be able to see your agent moving back and forth on-screen by using the 'enter' key to load the experiment scenes!**

### Congratulations, you've created your first movement component and attached it to an entity in the scene to control its movement!