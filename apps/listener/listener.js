import loader from '../../core/loader.js';
import config from '../../intentions/config.js'
import localization from '../../core/localization.js';

function addAnswer(data, answer, ext = true) {
    const offset = data.output.scrollTop + data.output.clientHeight;
    const sh = data.output.scrollHeight;
    const threshold = 10;
    answer.time = window.moment(answer.time);
    if (answer.alternatives == null) answer.alternatives = [];
    answer.ext = ext;
    data.answers.push(answer);
    if ((sh >= offset - threshold) && (sh <= offset + threshold))
        setTimeout(() => {
            data.output.scrollTop = data.output.scrollHeight - data.output.clientHeight;
        });
}

function createIntentions(vm, lang) {
    vm.iInteract = config.intentionStorage.createIntention({
        title: {
            en: 'Need possibility to interact with user',
            ru: 'Нужна возможность взаимодействия с пользователем'
        },
        input: 'Recognition',
        output: 'HTMLTextAreaElement',
        onData: async (status, intention, data) => {
            if (status == 'data')
                await addAnswer(vm, data, false);
        },
        parameters: [lang.speechRecognizer, vm.input]
    });

    vm.iPost = config.intentionStorage.createIntention({
        title: {
            en: 'Can post data to console',
            ru: 'Отправляю данные в пользовательскую консоль'
        },
        input: 'ContextText',
        output: 'None',
        onData: async (status, intention, value) => {
            if (status == 'data')
                await addAnswer(vm, value);
        }
    });
}

function deleteIntentions(vm) {
    config.intentionStorage.deleteIntention(vm.iInteract, 'client closed listener');
    config.intentionStorage.deleteIntention(vm.iPost, 'client closed listener');
}

loader.application('listener', [async () => {
    function init() {
        return {
            loaded: false,
            answers: [],
            showAlternatives: false,
            output: null,
            input: null
        }
    }


    const lang = localization.get();
    await loader.createVueTemplate({ path: 'listener.html', id: 'Listener-Template', meta: import.meta, localization: { use: lang.interface } });
    const res = {};
    res.Constructor = Vue.component('listener', {
        template: '#Listener-Template',
        data: init,
        methods: {
            toggleAlternatives: function (answer) {
                answer.showAlternatives = !answer.showAlternatives;
                this.$forceUpdate();
            },
            getText(contextText) {
                return localization.getText(lang, contextText);
            }
        },
        mounted: function () {
            this.output = this.$el.querySelector('.output');
            this.input = this.$el.querySelector('.content textarea');
            createIntentions(this, lang);
            this.loaded = true;
        },
        destroyed: function () {
            deleteIntentions(this);
            this.loaded = false;
        }
    });
    return res;
}]);