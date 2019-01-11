import loader from '../loader.js';
import '../router/router.js';

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