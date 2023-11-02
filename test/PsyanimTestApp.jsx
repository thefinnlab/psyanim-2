import React, { useEffect } from 'react';

import PsyanimTestInstructions from './PsyanimTestInstructions.jsx';
import PsyanimCanvas from './PsyanimCanvas.jsx';

import PsyanimApp from '../src/core/PsyanimApp.js';

export default function PsyanimTestApp() {

    useEffect(() => {

        PsyanimApp.Instance.setCanvasVisible(true);

        console.log('Psyanim Test App React Component rendering finished!');
    }, []);

    return (
        <>
            <PsyanimCanvas/>
            <PsyanimTestInstructions/>
        </>
    );
}