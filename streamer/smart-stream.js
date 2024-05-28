const { Readable } = require('stream');
const AWS = require('aws-sdk');

class SmartStream extends Readable {
    constructor(parameters, s3, maxLength, nodeReadableStreamOptions) {
        super(nodeReadableStreamOptions);
        this._currentCursorPosition = 0;
        this._s3DataRange = 2*1024 * 1024;
        this._maxContentLength = maxLength;
        this._s3 = s3;
        this._s3StreamParams = parameters;
    }

    _read() {
        if (this._currentCursorPosition >= this._maxContentLength) {
            this.push(null);
        } else {
            const rangeEnd = Math.min(this._currentCursorPosition + this._s3DataRange - 1, this._maxContentLength - 1);
            this._s3StreamParams.Range = `bytes=${this._currentCursorPosition}-${rangeEnd}`;
            this._currentCursorPosition = rangeEnd + 1;

            // Using arrow function to preserve 'this' context
            this._s3.getObject(this._s3StreamParams, (error, data) => {
                if (error) {
                    this.destroy(error);
                } else {
                    // console.log('STREAM DATA: ', data)
                    this.push(data.Body);
                }
            });
        }
    }
}

module.exports = SmartStream;
