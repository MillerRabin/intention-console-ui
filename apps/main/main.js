import loader from '../../core/loader.js';
import '../router/router.js';
import config from '../../intentions/config.js';
import '../listener/listener.js'
import '../tasks/tasks.js'
import localization from '../../core/localization.js';

function changeLanguage(lang) {
    const loc = localization.set(lang);
    window.location.assign(`/${loc.interface}/index.html`);
}

function createIntentions(vm) {
    config.intentionStorage.createIntention({
        title: {
            en: 'Console navigation',
            ru: 'Осуществляю навигацию по консоли'
        },
        input: 'None',
        output: 'NavigationResult',
        onData: async function onData(status, intention, value) {
            if (status != 'data') return;
            let vl = (value == null) ? intention.value : value;
            if (vl != null) {
                intention.send('completed', this, { success: true });
                router.push({ name: vl.value, params: { language: vm.lang.interface } });
            }
        }
    });
}

config.intentionStorage.createIntention({
    title: {
        en: 'Can change console localization',
        ru: 'Меняю локализацию консоли'
    },
    input: 'Language',
    output: 'ChangeLanguageOperationInfo',
    onData: async function onData(status, intention) {
        if (status != 'data') return;
        try {
            intention.send('completed', this, { success: true });
            const parameters = intention.parameters;
            changeLanguage(parameters[0].value);
        } catch (e) {
            console.log(e);
            intention.send('error', this, e);
        }
    }
});

class Main {
    constructor(mount) {
        this.mount = mount;
        this.langDlg = mount.querySelector('#Header dialog.lang');
        createIntentions(this);
    }

    showLangDialog() {
        this.langDlg.showModal();
    }
    selectLanguage() {
        changeLanguage(this.langRadio);
        this.langDlg.close();
    }
}

loader.globalContentLoaded.then(() => {
    const mount = window.document.getElementById('Intention');
    new Main(mount);
});