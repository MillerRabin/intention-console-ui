import loader from '../../core/loader.js';
import '../router/router.js';
import '../../intensions/config.js';

loader.application('Main', ['router', async (router) => {
    const data = {
        loaded: false,
        disabled: false
    };

    data.application = new Vue({
        el: '#Intension',
        router: router,
        data: data,
        methods: {},
        mounted: async function () {
            this.loaded = true;
        }
    });

    return data;
}]);