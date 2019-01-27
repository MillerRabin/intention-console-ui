import loader from '../../core/loader.js';

loader.application('storages', [async () => {
    function init() {
        return {
            loaded: false
        }
    }

    await loader.createVueTemplate({ path: 'storages.html', id: 'Storages-Template', meta: import.meta });
    const res = {};

    res.Constructor = Vue.component('storages', {
        template: '#Storages-Template',
        data: init,
        methods: {

        },
        mounted: function () {
            this.loaded = true;
        },
        destroyed: function () {
            this.loaded = false;
        }
    });
    return res;
}]);