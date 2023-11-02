import React from 'react';

import { Typography, Button } from '@mui/material';

export default function PsyanimTestInstructions() {

    return (
        <>

            <Typography variant="h4" id="sceneName" className="phaser-scene-title">Psyanim 2.0 Tests</Typography>

            <div id="testControls" className="test-controls">
                <Typography variant="body1">Use keys 'j' and 'k' to change scenes.</Typography>
                <Typography variant="body1">For scenes with a player controller, use WASD for movement.</Typography>
                <Typography variant="body1">Some scenes have a mouse follow target, so moving mouse will affect agents</Typography>
                <Typography variant="body1">Press 't' key to toggle physics time scale (can slow down / speed up simulation for debugging).</Typography>        
            </div>
        </>
    );
}