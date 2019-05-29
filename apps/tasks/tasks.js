import loader from '../../core/loader.js';
import localization from '../../core/localization.js';
import config from '../../intentions/config.js'

function createIntentions(vm) {
    vm.iTasks = config.intentionStorage.createIntention({
        title: {
            en: 'Need access to tasks information',
            ru: 'Нужен доступ к списку задач'
        },
        input: 'TaskInfo',
        output: 'None',
        onData: async (status, intention, interfaceObject) => {
            if (status == 'data')
                Vue.set(vm, 'tasks', interfaceObject.query());
        }
    });
}

function deleteIntentions(vm) {
    config.intentionStorage.deleteIntention(vm.iTasks, 'client tasks');
}


class Task {
    constructor(mount) {
        this.mount = mount;
        createIntentions(this);
    }
    getText(contextText) {
        return localization.getText(lang, contextText);
    }
    unmount() {
        deleteIntentions(this);
    }
}