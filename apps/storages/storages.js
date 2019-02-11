import loader from '../../core/loader.js';
import localization from '../../core/localization.js';
import intentionStorage from '/node_modules/intention-storage/browser/main.js';

function createIntentions(vm) {
    intentionStorage.enableStats();
    vm.intention = intentionStorage.create({
        title: {
            en: 'Need data about linked storages',
            ru: 'Необходимы данные о связанных хранилищах'
        },
        input: 'StorageStats',
        output: 'None',
        onData: async (status, intention, interfaceObject) => {
            if (status != 'data') return;
            vm.ilist = interfaceObject.query();
        }
    });
}

function deleteIntentions(vm) {
    intentionStorage.delete(vm.intention, 'client closed browser');
}


loader.application('storages', [async () => {
    function init() {
        return {
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