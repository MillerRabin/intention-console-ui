let enableListener = false;

function createRecognition(lang) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition == null) throw new Error('Speech recognition is not supported');
    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;
    recognition.continuous = true;
    return recognition;
}

function startRecognition(recognition) {
    recognition.onresult = (event) => {
        try {
            const last = event.results[event.results.length - 1];
            const dataEvent = new Event('data');
            dataEvent.results = last;
            recognition.dispatchEvent(dataEvent);
        } catch(e) {
            console.log(e);
        }
    };

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

    stopRecognition(recognition);
    try {
        if (!enableListener) throw new Error('Sound listening is disabled');
        recognition.start();
    } catch (e) {
        if (e.name == 'InvalidStateError') {
            setTimeout(() => {
                startRecognition(recognition)
            }, 1000);
        }
        console.log(e);
    }
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