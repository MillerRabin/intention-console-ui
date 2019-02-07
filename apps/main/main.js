import loader from '../../core/loader.js';
import '../router/router.js';
import '../../intentions/config.js';
import '../listener/listener.js'
import '../tasks/tasks.js'
import localization from '../../core/localization.js';
import IntentionStorage from '/node_modules/intention-storage/browser/main.js';

function changeLanguage(lang) {
    const loc = localization.set(lang);
    window.location.assign(`/${loc.interface}/index.html`);
}

loader.application('Main', ['router', 'listener', async (router) => {
    const data = {
        loaded: false,
        disabled: false,
        active: 1,
        langDlg: null,
        lang: null,
        langRadio: null
    };

    data.application = new Vue({
        el: '#Intention',
        router: router,
        data: data,
        methods: {
            showLangDialog: function () {
                this.langDlg.showModal();
            },
            selectLanguage: function () {
                setTimeout(() => {
                    changeLanguage(this.langRadio);
                    this.langDlg.close();
                });
            }
        },
        mounted: async function () {
            this.loaded = true;
            this.active = this.$route.meta.active;
            this.lang = localization.get();
            this.langDlg = this.$el.querySelector('#Header dialog.lang')
        }
    });

    return data;
}]);

IntentionStorage.create({
    title: {
        en: 'Can change console localization',
        ru: 'Меняю локализацию консоли'
    },
    input: 'Language',
    output: 'ChangeLanguageOperationInfo',
    onData: async function onData(status, intention) {
        if ((status != 'accept') && (status != 'data')) return;
        try {
            intention.send('data', this, { success: true });
            const parameters = intention.parameters;
            changeLanguage(parameters[0].value);
        } catch (e) {
            console.log(e);
            intention.send('error', this, e);
        }
    }
});