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

class Listener {
    constructor(mount) {
        this.mount = mount;
        this.output = this.$el.querySelector('.output');
        this.input = this.$el.querySelector('.content textarea');
        const lang = localization.get();
        createIntentions(this, lang);
        this.loaded = true;
    }
    unmount() {
        deleteIntentions(this);
        this.loaded = false;
    }

    toggleAlternatives(answer) {
        answer.showAlternatives = !answer.showAlternatives;
        this.$forceUpdate();
    }

    getText(contextText) {
        const lang = localization.get();
        return localization.getText(lang, contextText);
    }
}

export default Listener;