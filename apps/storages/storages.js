import loader from '../../core/loader.js';
import localization from '../../core/localization.js';
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

loader.application('storages', [async () => {
    function init() {
        return {
            ilist: [],
            loaded: false
        }
    }

    const lang = localization.get();
    await loader.createVueTemplate({ path: 'storages.html', id: 'Storages-Template', meta: import.meta, localization: { use: lang.interface } });
    const res = {};

    res.Constructor = Vue.component('storages', {
        template: '#Storages-Template',
        data: init,
        methods: {

        },
        mounted: function () {
            this.loaded = true;
            createIntentions(this);
        },
        destroyed: function () {
            deleteIntentions(this);
            this.loaded = false;
        }
    });
    return res;
}]);