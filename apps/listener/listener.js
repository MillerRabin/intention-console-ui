import loader from '../loader.js';

function createRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;
    recognition.continuous = true;
    return recognition;
}

function getAnswer(params) {
    params.time = window.moment();
    params.alternatives = (params.alternatives == null) ? [] : params.alternatives;
    params.text = (params.text == null) ? '' : params.text;
    return params;
}

function formatAnswer(results) {
    const text = results[0].transcript;
    const alt = [];
    for (let i = 1; i < results.length; i++)
        alt.push(results[i]);
    return getAnswer({
        alternatives: alt,
        text,
        time: window.moment()
    });
}

function createAnswer(data) {
    const answer = getAnswer({ text: data.newText});
    data.answers.push(answer);
}


function startRecognition(recognition, data) {
    recognition.onresult = (event) => {
        const last = event.results[event.results.length - 1];
        const answer = formatAnswer(last);
        data.answers.push(answer);
    };

    recognition.onerror = function(event) {
        console.log('Error occurred in recognition: ' + event.error);
        if (event.error != 'aborted')
            setTimeout(() => {
                startRecognition(recognition, data)
            }, 0);
    };

    recognition.onend = function(error) {
        console.log('On end. Trying to restart');
        setTimeout(() => {
            startRecognition(recognition, data)
        }, 100);
    };

    stopRecognition(recognition);
    try {
        if (!enableListener) throw new Error('Sound listening is disabled');
        recognition.start();
    } catch (e) {
        console.log(e);
    }
}

function enableRecognition(recognition, data) {
    enableListener = true;
    startRecognition(recognition, data);
}

function disableRecognition(recognition) {
    enableListener = false;
    stopRecognition(recognition);
}

function stopRecognition(recognition) {
    recognition.abort();
}

function dispatchAnswer(event, data) {
    if (!event.ctrlKey && (event.keyCode == 13)){
        if (data.newText == '') {
            event.stopPropagation();
            event.preventDefault();
            return;
        }
        createAnswer(data);
        setTimeout(() => {
            data.newText = '';
            data.$forceUpdate();
        });
    }
}

let enableListener = false;

loader.application('listener', [async () => {
    function init() {
        return {
            loaded: false,
            newText: '',
            answers: [],
            showAlternatives: false
        }
    }

    await loader.createVueTemplate({ path: 'apps/listener/listener.html', id: 'Listener-Template' });
    const res = {};
    const recognition = createRecognition();
    let typeInterval = null;
    const typeTimeout = 1000;

    res.Constructor = Vue.component('listener', {
        template: '#Listener-Template',
        data: init,
        methods: {
            toggleAlternatives: function (answer) {
                answer.showAlternatives = !answer.showAlternatives;
                this.$forceUpdate();
            },
            startTyping: function (event) {
                dispatchAnswer(event, this);
                disableRecognition(recognition);
                if (typeInterval != null) clearInterval(typeInterval);
                typeInterval = setTimeout(() => {
                    enableRecognition(recognition, this);
                }, typeTimeout);
            }
        },
        mounted: function () {
            this.loaded = true;
            enableRecognition(recognition, this);
        },
        destroyed: function () {
            disableRecognition(recognition);
        }
    });
    return res;
}]);