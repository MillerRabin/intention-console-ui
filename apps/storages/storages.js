import config from '../../intentions/config.js'

function createIntentions(vm) {
    vm.intention = config.intentionStorage.createIntention({
        title: {
            en: 'Need data about linked storages',
            ru: 'Необходимы данные о связанных хранилищах'
        },
        input: 'StorageStats',
        output: 'None',
        onData: async (status, intention, interfaceObject) => {
            if (status != 'data') return;
            Vue.set(vm, 'ilist', interfaceObject.queryLinkedStorages());
        }
    });
}

function deleteIntentions(vm) {
    config.intentionStorage.deleteIntention(vm.intention, 'client closed browser');
}

export default class Storages {
    constructor(mount) {
        this.mount = mount;
        createIntentions(this);
    }

    unmount() {
        deleteIntentions(this);
    }
}