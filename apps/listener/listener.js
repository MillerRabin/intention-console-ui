import loader from '../../core/loader.js';
import intensions from '/node_modules/intension-storage/browser/main.js';


function addAnswer(data, answer) {
    const offset = data.output.scrollTop + data.output.clientHeight;
    const sh = data.output.scrollHeight;
    const threshold = 10;
    data.answers.push(answer);
    if ((sh >= offset - threshold) && (sh <= offset + threshold))
        setTimeout(() => {
            data.output.scrollTop = data.output.scrollHeight - data.output.clientHeight;
        });
}

async function onData({data, answer}) {
    addAnswer(data, answer);
}

loader.application('listener', [async () => {
    function init() {
        return {
            loaded: false,
            answers: [],
            showAlternatives: false,
            output: null,
            input: null,
            intension: null
        }
    }

    await loader.createVueTemplate({ path: 'apps/listener/listener.html', id: 'Listener-Template' });
    const res = {};
    res.Constructor = Vue.component('listener', {
        template: '#Listener-Template',
        data: init,
        methods: {
            toggleAlternatives: function (answer) {
                answer.showAlternatives = !answer.showAlternatives;
                this.$forceUpdate();
            }
        },
        mounted: function () {
            this.loaded = true;
            this.output = this.$el.querySelector('.output');
            this.input = this.$el.querySelector('.content textarea');
            this.intension = intensions.create({
                title: 'Need interact with user',
                input: 'Recognition',
                output: 'HTMLTextAreaElement',
                onData: async (status, intension, data) => {
                    if (status == 'data')
                        await onData({ data: this, answer: data });
                },
                parameters: [this.input]
            });
        },
        destroyed: function () {
            intensions.delete(this.intension, 'client closed listener');
        }
    });
    return res;
}]);