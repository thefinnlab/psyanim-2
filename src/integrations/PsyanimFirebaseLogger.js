export default class PsyanimFirebaseLogger {

    flushFrequency; 

    constructor(sessionID, firebaseClient) {
        
        this._sessionID = sessionID;
        this._firebaseClient = firebaseClient;

        this._msgBuffer = [];

        this._autoFlush = true;
        this._flushFrequency = 10000;
        this._flushBufferIntervalId = setInterval(this._flushMsgBuffer.bind(this), this._flushFrequency);

        this._lastWriteIndex = -1;
    }

    get autoFlush() {

        return this._autoFlush;
    }

    set autoFlush(value) {

        if (value == true && !this._flushBufferIntervalId)
        {
            this._setFlushInterval();
        }
        else if (this._flushBufferIntervalId)
        {
            clearInterval(this._flushBufferIntervalId);
            this._flushBufferIntervalId = undefined;
        }
    }

    /** how often to flush internal msg buffer to firestore, in ms */
    get flushFrequency() {
        return this._flushFrequency;
    }

    set flushFrequency(value) {

        this._flushFrequency = value;

        this._setFlushInterval();
    }

    _setFlushInterval() {

        clearInterval(this._flushBufferIntervalId);

        this._flushBufferIntervalId = setInterval(this._flushMsgBuffer.bind(this), this._flushFrequency);
    }

    _flushMsgBuffer() {

        if (this._msgBuffer.length - 1 > this._lastWriteIndex)
        {
            this._firebaseClient.writeSessionLogData(this._sessionID, this._msgBuffer);

            this._lastWriteIndex = this._msgBuffer.length - 1;
        }
    }

    log(msg) {

        this._msgBuffer.push({
            type: 'log',
            msg: msg,
            clientTime: Date.now()
        });

        console.log(msg);
    }

    warn(msg) {

        this._msgBuffer.push({
            type: 'warn',
            msg: msg,
            clientTime: Date.now()
        });

        console.warn(msg);
    }

    error(msg) {

        this._msgBuffer.push({
            type: 'error',
            msg: msg,
            clientTime: Date.now()
        });

        console.error(msg);
    }
}