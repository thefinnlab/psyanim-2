
export default class PsyanimFloat32ArrayMessage {

    constructor(type, userDefinedJsonHeader, payload) {

        this._type = type; // 4 byte integer
        this._userDefinedHeader = JSON.stringify(userDefinedJsonHeader);
        this._userDefinedHeaderLength = this._userDefinedHeader.length;
        this._payload = payload;
        this._payloadLength = arrayPayload.length;
    }
    
}