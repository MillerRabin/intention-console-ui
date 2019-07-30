let enableListener = false;

let dTimer = null;
function dispatchSpeechResult(event) {
    if (dTimer != null)
        clearTimeout(dTimer);
    dTimer = setTimeout(function () {
        dTimer = null;
        try {
            const last = event.results[event.results.length - 1];
            const dataEvent = new Event('data');
            dataEvent.results = last;
            this.dispatchEvent(dataEvent);
        } catch(e) {
            console.log(e);
        }
    }, 100);
}

function createRecognition(lang) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition == null) throw new Error('Speech recognition is not supported');
    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;
    recognition.continuous = true;
    recognition.onresult = dispatchSpeechResult;

    recognition.onerror = function(event) {
        console.log('Error occurred in recognition: ' + event.error);
        if (event.error == 'not-allowed')
            disableRecognition(recognition);
    };

    recognition.onend = function() {
        console.log('On end. Trying to restart');
        setTimeout(() => {
            startRecognition(recognition)
        }, 100);
    };

    return recognition;
}

function startRecognition(recognition) {
    stopRecognition(recognition);
    if (!enableListener) throw new Error('Sound listening is disabled');
    setTimeout(function () {
        try {
            recognition.start();
        } catch (e) {
            console.log(e);
        }

    }, 1000)
}

function enableRecognition(recognition) {
    if (recognition == null) return;
    enableListener = true;
    startRecognition(recognition);
}

function disableRecognition(recognition) {
    enableListener = false;
    if (recognition == null) return;
    stopRecognition(recognition);
}

function stopRecognition(recognition) {
    if (recognition == null) return;
    recognition.abort();
}

const recognition = createRecognition('en-US');

function enable() {
    enableRecognition(recognition);
}

function disable() {
    disableRecognition(recognition);
}

export default {
    enable,
    disable,
    recognition
}