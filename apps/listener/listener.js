import loader from '../loader.js';

loader.application('listener', [async () => {
    function init() {
        return {
            loaded: false,
            rText: ''
        }
    }

    await loader.createVueTemplate({ path: 'apps/listener/listener.html', id: 'Listener-Template' });
    const res = {};
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
    const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

    res.Constructor = Vue.component('listener', {
        template: '#Listener-Template',
        data: init,
        watch:{
            $route (){
                this.recognition.stop();
            }
        },
        methods: {},
        mounted: function () {
            this.loaded = true;
            const recognition = new SpeechRecognition();
            recognition.lang = 'ru-RU';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;
            recognition.continuous = true;
            recognition.onresult = (event) => {
                const last = event.results.length - 1;
                this.rText += event.results[last][0].transcript;
                this.$forceUpdate();
                console.log(this.rText);
                console.log('Confidence: ' + event.results[0][0].confidence);
            };

            recognition.onnomatch = function(event) {
                console.log('I didnt recognise that color.');
            };

            recognition.onerror = function(event) {
                console.log('Error occurred in recognition: ' + event.error);
            };

            recognition.onaudioend = function() {
                console.log('stopped');
            };

            recognition.start();
            this.recognition = recognition;
        }
    });
    return res;
}]);