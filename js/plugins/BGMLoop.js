(function(){
    'use strict';
    WebAudio.prototype._onXhrLoad = function(xhr) {
        var array = xhr.response;
        if(Decrypter.hasEncryptedAudio) array = Decrypter.decryptArrayBuffer(array);
        this._readLoopComments(new Uint8Array(array));
        WebAudio._context.decodeAudioData(array, function(buffer) {
            this._buffer = buffer;
            this._totalTime = buffer.duration;
            if (this._loopLength > 0 && this._sampleRate > 0) {
                this._loopStart /= this._sampleRate;
                this._loopLength /= this._sampleRate;
            } else {
                this._loopStart = 0;
                this._loopLength = this._totalTime;
            }
            this._onLoad();
        }.bind(this));
    };
})();
