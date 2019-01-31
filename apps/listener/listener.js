import loader from '../../core/loader.js';
import intensionStorage from '/node_modules/intension-storage/browser/main.js';

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

function createIntensions(vm) {
    vm.iInteract = intensionStorage.create({
        title: 'Need interact with user',
        input: 'Recognition',
        output: 'HTMLTextAreaElement',
        onData: async (status, intension, data) => {
            if (status == 'data')
                await addAnswer(vm, data, false);
        },
        parameters: [vm.input]
    });

    vm.iPost = intensionStorage.create({
        title: 'Can post data to console',
        input: 'ContextText',
        output: 'None',
        onData: async (status, intension, value) => {
            if (status == 'data')
                await addAnswer(vm, value);
        }
    });
}

function deleteIntensions(vm) {
    intensionStorage.delete(vm.iInteract, 'client closed listener');
    intensionStorage.delete(vm.iPost, 'client closed listener');
}

loader.application('listener', [async () => {
    function init() {
        return {
            loaded: false,
            answers: [],
            showAlternatives: false,
            output: null,
            input: null,
            culture: 'ru'
        }
    }

    await loader.createVueTemplate({ path: 'listener.html', id: 'Listener-Template', meta: import.meta });
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
                if (typeof(contextText) == 'string') return contextText;
                let text = contextText[this.culture];
                if (text != null) return text;
                const vals = Object.values(contextText);
                return vals[0];
            }
        },
        mounted: function () {
            this.output = this.$el.querySelector('.output');
            this.input = this.$el.querySelector('.content textarea');
            createIntensions(this);
            this.loaded = true;
        },
        destroyed: function () {
            deleteIntensions(this);
            this.loaded = false;
        }
    });
    return res;
}]);