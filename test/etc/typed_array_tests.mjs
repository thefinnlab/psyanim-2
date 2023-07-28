import PsyanimFloat32ArrayMessage from '../../utils/PsyanimFloat32ArrayMessage.mjs';


/**
 *  We need to encode the user defined header into a typed array
 */

let messageType = 42; // 4-byte integer type

let jsonHeader = {

    rootDir: '/this/is/a/test/',
    filenameBase: 'fileABC',
    fileExtension: '.txt'
};

/**
 *  Construct the payload
 */
let payload = new Float32Array([0.1, 1.2, 2.3, 3.4, 5.6, 6.7, 7.8, 8.9, 9.0]);

/**
 *  Construct the full message from the parts
 */

let message = new PsyanimFloat32ArrayMessage(messageType, jsonHeader, payload);

let serializedMessage = message.toBytes();

/**
 *  Now let's read back the data from the serialized message!
 */

let deserializedMessage = PsyanimFloat32ArrayMessage.fromBytes(serializedMessage);

let standardHeader = {
    type: deserializedMessage.type,
    userDefinedHeaderLength: deserializedMessage.userDefinedHeaderLength,
    paddingBytesLength: deserializedMessage.paddingBytesLength,
    payloadLength: deserializedMessage.payloadLength
}

console.log(standardHeader);

console.log(deserializedMessage.userDefinedJsonHeader);

console.log(deserializedMessage.payload);