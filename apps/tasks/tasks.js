import loader from '../../core/loader.js';
import localization from '../../core/localization.js';
import config from '../../intentions/config.js'

const gTemplateP = loader.request(`/apps/tasks/tasks.html`);

function createIntentions(tasks) {
    tasks.iTasks = config.intentionStorage.createIntention({
        title: {
            en: 'Need access to tasks information',
            ru: 'Нужен доступ к списку задач'
        },
        input: 'TaskInfo',
        output: 'None',
        onData: async (status, intention, interfaceObject) => {
            if (status == 'data')
                tasks.data = interfaceObject.query();
        }
    });
}

function deleteIntentions(vm) {
    config.intentionStorage.deleteIntention(vm.iTasks, 'client tasks');
}

function updateTasks(tasks) {
    if (tasks._data == null) return '';
    const templates = [];
    for (let task of tasks._data)  {
        const template =
            `<div class="task"
                <h2>${getText(task.name)}</h2>
                <p>${getText(task.status)}</p>
            </div>`;
        templates.push(template);
    }
    tasks._content.innerHTML = templates.join('');
}


async function render(tasks) {
    const template = await gTemplateP;
    tasks._mount.innerHTML = template.text;
    tasks._content = this._mount.querySelector('.content');
}

function getText(contextText) {
    const lang = localization.get();
    return localization.getText(lang, contextText);
}

export default class Task {
    constructor(mount) {
        this._mount = mount;
        this._data = null;
        createIntentions(this);
        render();
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
        updateTasks(this);
    }

    unmount() {
        deleteIntentions(this);
    }
}
