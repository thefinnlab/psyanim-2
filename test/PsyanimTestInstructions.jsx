import React from 'react';

export default function PsyanimTestInstructions() {

    return (
        <>
            <h3>Use keys 'j' and 'k' to change scenes.</h3>
            <h3>For scenes with a player controller, use WASD for movement.</h3>
            <h3>Some scenes have a mouse follow target, so moving mouse will affect agents</h3>
            <h3>Press 't' key to toggle physics time scale (can slow down / speed up simulation for debugging).</h3>        
        </>
    );
}