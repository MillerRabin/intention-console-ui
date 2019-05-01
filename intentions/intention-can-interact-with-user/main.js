import speech from './speech.js';
import keyboard from './keyboard.js';

let typeInterval = null;
const typeTimeout = 1000;

const gParamHash = {};

function getAnswer(params) {
    params.alternatives = (params.alternatives == null) ? [] : params.alternatives;
    params.text = (params.text == null) ? '' : params.text;
    return params;
}

function formatSpeechAnswer({ time, results}) {
    const text = results[0].transcript.trim();
    const alt = [];
    for (let i = 1; i < results.length; i++)
        alt.push(results[i]);
    return getAnswer({
        alternatives: alt,
        text,
        time: time
    });
}

function pauseSpeech() {
    speech.disable();
    if (typeInterval != null) clearInterval(typeInterval);
    typeInterval = setTimeout(() => {
        speech.enable();
    }, typeTimeout);
}

function onKeyboardData(event) {
    const answer = getAnswer({ text: event.value, time: new Date() });
    gIntention.accepted.send(answer);
}

function onSpeechData(event) {
    const answer = formatSpeechAnswer({ results: event.results, time: new Date() });
    gIntention.accepted.send(answer);
}

function start(lang, input) {
    if (input != null) {
        stop(input);
        input.addEventListener('keydown', pauseSpeech);
        input.addEventListener('data', onKeyboardData);
        speech.recognition.addEventListener('data', onSpeechData);
        keyboard.enable(input);
    }
    if (lang != null)
        speech.recognition.lang = lang;
    speech.enable();
}

function stop(input) {
    if (input != null) {
        input.removeEventListener('keydown', pauseSpeech);
        input.removeEventListener('data', onKeyboardData);
        speech.recognition.removeEventListener('data', onSpeechData);
        keyboard.disable(input);
    }
    speech.disable();
}

let gIntention = null;

function init(intentionStorage) {
    gIntention = intentionStorage.createIntention({
        title: {
            en: 'Can receive raw user input from microphone or keyboard',
            ru: 'Забираю пользовательский ввод с микрофона или клавиатуры'
        },
        input: 'HTMLTextAreaElement',
        output: 'Recognition',
        onData: async function (status, intention) {
            if (status == 'accept') {
                const parameters = intention.parameters;
                const lang = parameters[0];
                const input = parameters[1];
                gParamHash[intention.id] = input;
                start(lang, input);
                return;
            }
            if (status == 'close') {
                const input = gParamHash[intention.id];
                stop(input);
                delete gParamHash[intention.id];
            }
        }
    });
}

export default {
    init, start, stop
}