import speech from './speech.js';
import keyboard from './keyboard.js';
import intensions from '../../services/IntensionStorage/IntensionStorage.js';

let typeInterval = null;
const typeTimeout = 1000;

function getAnswer(params) {
    params.time = window.moment();
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
    const answer = getAnswer({ text: event.value, time: event.timestamp });
    gIntension.accepted.send(answer);
}

function onSpeechData(event) {
    const answer = formatSpeechAnswer({ results: event.results, time: event.timestamp });
    gIntension.accepted.send(answer);
}

function start(input) {
    stop(input);
    input.addEventListener('keydown', pauseSpeech);
    input.addEventListener('data', onKeyboardData);
    speech.recognition.addEventListener('data', onSpeechData);
    keyboard.enable(input);
    speech.enable();
}

function stop(input) {
    input.removeEventListener('keydown', pauseSpeech);
    input.removeEventListener('data', onKeyboardData);
    speech.recognition.removeEventListener('data', onSpeechData);
    keyboard.disable(input);
    speech.disable();
}

async function onAccept(intension) {
    const parameters = intension.getParameters();
    const input = parameters[0];
    if (input == null) throw new Error('HTMLTextAreaElement must be the first parameter');
    gIntension.input = input;
    start(input);
}

async function onData(intension) {}

async function onError(intension, error) {
    console.log('on Error');
    console.log(intension);
    console.log(error);
}

async function onClose(intension, info) {
    console.log(info);
    stop(gIntension.input);
}

const gIntension = intensions.create({
    title: 'can interact with user',
    input: 'HTMLTextAreaElement',
    output: 'Recognition',
    onAccept: onAccept,
    onData: onData,
    onClose: onClose,
    onError: onError
});


export default {
    start, stop
}