import PsyanimConstants from '../../src/core/PsyanimConstants.js';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController.js';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController.js';
import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle.js';

import BlackboardTest from '../components/BlackboardTest.js';
import PsyanimBehaviorTreeBlackboard from '../../src/core/components/ai/bt/PsyanimBehaviorTreeBlackboard.js';

export default {

    key: 'Blackboard Test',
    entities: [
        {
            name: 'sceneControls',
            components: [
                { type: PsyanimSceneTitle },
                { type: PsyanimPhysicsSettingsController },
                { type: PsyanimSceneChangeController }
            ]
        },
        {
            name: 'blackboardTest',
            components: [
                { type: BlackboardTest },
                {
                    type: PsyanimBehaviorTreeBlackboard,
                    params: {
                        name: 'My Test Blackboard',
                        stringPayload: 'Hello blackboard!',
                        numberPayload: 42,
                        booleanPayload: true,
                        myEntity: {
                            entityName: 'sceneControls'
                        }
                    }
                }
            ]
        },
    ]
};