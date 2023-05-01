export default class PsyanimDebug {

    static _vec2ToString(name, vector) {

        let vecString = name + " = ( ";
        vecString += vector.x.toString();
        vecString += ", ";
        vecString += vector.y.toString();
        vecString += " )";

        return vecString;
    }
}