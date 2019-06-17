import loader from '../../core/loader.js';
import router from '../router/router.js';
import config from '../../intentions/config.js';
import Listener from '../listener/listener.js';
import Tasks from '../tasks/tasks.js'
import localization from '../../core/localization.js';
import Header from '../header/header.js';

let gMount =  null;
let listener = null;
let tasks = null;

function createIntentions() {
    const lang = localization.get();
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
                router.push({ name: vl.value, params: { language: lang.interface } });
            }
        }
    });
}

const loaded = loader.globalContentLoaded.then(() => {
    const headerM = window.document.getElementById('Header_Container');
    headerM.scope = new Header(headerM);
    gMount = window.document.getElementById('Intention');
    const listenerM = window.document.getElementById('Listener');
    listener = new Listener(listenerM);
    listenerM.scope = listener;
    const tasksM = window.document.getElementById('Tasks');
    tasks = new Tasks(tasksM);
    tasksM.scope = tasks;
    createIntentions();
});

export default {
    loaded
}