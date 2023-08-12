class PsyanimConsoleLogger {

    log(msg) {
        console.log(msg);
    }

    warn(msg) {
        console.warn(msg);
    }

    error(msg) {
        console.error(msg);
    }
}

export default class PsyanimDebug {

    static log(msg) {

        PsyanimDebug.logger.log(msg);
    }

    static warn(msg) {

        PsyanimDebug.logger.warn(msg);
    }

    static error(msg) {

        PsyanimDebug.logger.error(msg);
    }

    static _vec2ToString(name, vector) {

        let vecString = name + " = ( ";
        vecString += vector.x.toString();
        vecString += ", ";
        vecString += vector.y.toString();
        vecString += " )";

        return vecString;
    }
}

PsyanimDebug.logger = new PsyanimConsoleLogger();