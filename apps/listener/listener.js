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

function formatAnswer(results) {
    const text = event.results[0][0].transcript;
    return {
        alternatives: event.results,
        text: data.newText
    };
}


function startRecognition(recognition, data) {
    recognition.onresult = (event) => {
        console.log(event.results[0]);
        const answer = formatAnswer(event.results);
        data.rtext =answer.text;
        data.answers.push(answer);
    };

    recognition.onerror = function(event) {
        console.log('Error occurred in recognition: ' + event.error);
        if (event.error != 'aborted')
            setTimeout(() => {
                startRecognition(recognition, data)
            }, 0);
    };

    recognition.onaudioend = function(error) {
        console.log('Stopped. Restarting');
        setTimeout(() => {
            startRecognition(recognition, data)
        }, 1000);
    };

    stopRecognition(recognition);
    try {
        if (!enableListener) throw new Error('Sound listening is disabled');
        recognition.start();
    } catch (e) {
        console.log(e);
    }
}

function stopRecognition(recognition) {
    recognition.abort();
}

let enableListener = false;

loader.application('listener', [async () => {
    function init() {
        return {
            loaded: false,
            newText: '',
            answers: []
        }
    }

    await loader.createVueTemplate({ path: 'apps/listener/listener.html', id: 'Listener-Template' });
    const res = {};
    const recognition = createRecognition();

    res.Constructor = Vue.component('listener', {
        template: '#Listener-Template',
        data: init,
        methods: {},
        mounted: function () {
            this.loaded = true;
            enableListener = true;
            startRecognition(recognition, this);
        },
        destroyed: function () {
            enableListener = false;
            stopRecognition(recognition);
        }
    });
    return res;
}]);