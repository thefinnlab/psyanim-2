
let messageType = 1; // 4-byte integer type

/**
 *  We need to encode the user defined header into a typed array
 */

// 
let userDefinedHeaderJSON = {

    rootDir: '/this/is/a/test/',
    filenameBase: 'testFile',
    fileExtension: '.txt'
};

let userDefinedHeaderString = JSON.stringify(userDefinedHeaderJSON);

let userDefinedHeaderBytes = new TextEncoder().encode(userDefinedHeaderString);
let userDefinedHeaderLength = userDefinedHeaderBytes.length;

/**
 *  Construct the payload
 */
let payload = new Float32Array([0.1, 1.2, 2.3, 3.4, 5.6, 6.7, 7.8, 8.9, 9.0]);

// 'payloadBytes' is just a new view of the same underlying buffer as 'payload'
let payloadBytes = new Uint8Array(payload.buffer);

let payloadLength = payloadBytes.length;

/**
 *  Construct the full message from the parts
 */

// allocate memory for UI, padding message out to an integer-multiple of 4
let paddedMessageLength = 4.0 * Math.ceil((12 + userDefinedHeaderLength + payloadLength) / 4.0);
let message = new Uint8Array(paddedMessageLength);

// create a view of the array as 32-bit ints
let messageViewUint32 = new Uint32Array(message.buffer, 0, 3);

// copy the message type, header length and payload length into the first 12 bytes
messageViewUint32[0] = messageType;
messageViewUint32[1] = userDefinedHeaderLength;
messageViewUint32[2] = payloadLength;

// copy the header into the array starting from byte index 12
message.set(userDefinedHeaderBytes, 12);

// copy the payload into the array starting from the appropriate offset
let payloadOffset = 12 + userDefinedHeaderLength;

message.set(payloadBytes, payloadOffset);

/**
 *  Now let's read back the data from the serialized message!
 */

let standardHeader = {
    messageType: messageViewUint32[0],
    headerLength: messageViewUint32[1],
    payloadLength: messageViewUint32[2]
}

console.log(standardHeader);

// TODO: get header back as:
// let headerString = new TextDecoder().decode(uint8array);

// TODO: get payload back via a Float32Array w/ the appropriate byte offset and length in constructor