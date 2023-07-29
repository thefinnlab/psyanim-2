export default class PsyanimMessaging {

    static MESSAGE_HEADER_LENGTH = 4; // bytes

    static MESSAGE_TYPES = {
        ANIMATION_CLIP: 0x0001, 
    };

    static getHeader(buffer) {

        let data = new Uint32Array(buffer);

        return data[0];
    }

    static setHeader(buffer, value) {

        let data = new Uint32Array(buffer);

        data[0] = value;
    }
}