import React, { useEffect } from "react";

import PsyanimApp from "../../core/PsyanimApp.js";

export default function PsyanimCanvas() {

    useEffect(() => {

        PsyanimApp.Instance.run();

        PsyanimApp.Instance.setCanvasVisible(false);

        console.log('Psyanim Canvas React Component finished rendering!');
    }, []);

    return (
        <>
            <div id="phaser-app" className="phaser-canvas"></div>
        </>
    );
}