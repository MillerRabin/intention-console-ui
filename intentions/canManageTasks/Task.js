import IntentionStorage from '/node_modules/intention-storage/browser/main.js';

function resolveParameters(task) {
    const up = task._parameters.filter(p => (p.value === undefined));
    if (up.length == 0) return true;
    const parameter = up[0];
    task.list.waitTypes(parameter.context.name, task);
    task._status = {
        ru: `Ожидаю ${ parameter.context.name }`,
        en: `Waiting ${ parameter.context.name }`
    };
    iPost.accepted.send({
        text: parameter.context,
        context: task._name,
        time: new Date()
    });
    return false;
}

function searchParameter(name, structures) {
    for (let structure of structures) {
        const value = structure.value;
        if (value.type != 'type') continue;
        if (value.name.name.toLowerCase() == name) return structure
    }
    return null;
}

function executeIntentions(task) {
    if (task._intentions == null) return;
    for (let intention of task._textIntentions) {
        task._status = {
            ru: 'Выполняю',
            en: 'Executing'
        };
        task.list.update(task, 'executing');
        task._intentions.push(IntentionStorage.create({
            title: intention.title,
            description: intention.description,
            input: intention.input,
            output: intention.output,
            parameters: task._parameters.map((p) => {
                return { value: p.value.value, type: p.value.name.name }
            }),
            onData: async (status, intention, data) => {
                task._log.push({
                    status: status,
                    intention: intention,
                    data: data
                });
                if ((status == 'data') || (status == 'error')) {
                    task.complete();
                }
            }
        }));
    }
}

function getParameters(parameters, structures) {
    const res = [];
    for (let parameter of parameters) {
        const st = searchParameter(parameter.name.toLowerCase(), structures);
        const tp = {
            context: Object.assign({}, parameter),
            value: (st != null) ? st.value : undefined
        };
        tp.context.name = tp.context.name.toLowerCase();
        res.push(tp);
    }
    return res;
}

export default class Task {
    constructor({
        name,
        key,
        parameters = [],
        structures = [],
        intentions
    }) {
        if (key == null) throw new Error('Key is undefined;');
        this._id = IntentionStorage.generateUUID();
        this._structures = structures;
        this._parameters = getParameters(parameters, structures);
        this._name = name;
        this._dependencies = new Set();
        this.onExecute = this.complete;
        this.list = null;
        this._textIntentions = intentions;
        this._intentions = [];
        this._log = [];
        this._status = '';
        this._key = key;
    }
    execute() {
        if (!resolveParameters(this)) return;
        executeIntentions(this);
        this.onExecute();
    }
    addDependency(task) {
        this._dependencies.add(task);
    }
    complete() {
        if (this._intentions != null) {
            for (let intention of this._intentions) {
                IntentionStorage.delete(intention);
            }
        }
        this.list.delete(this);
        for (let dep of this._dependencies) {
            this.list.delete(dep);
        }
    }
    searchParameterByType(type) {
        return this._parameters.find(p => (p.context.name == type) && (p.value === undefined));
    }
    get name() {
        return this._name;
    }
    get id() {
        return this._id;
    }
    get key() {
        return this._key;
    }
    toObject() {
        return {
            id: this._id,
            name: this._name,
            status: this._status
        }
    }
}

const iPost = IntentionStorage.create({
    title: {
        en: 'Sends task execution statuses into user console',
        ru: 'Отправляет информацию о выполнении задач в пользовательскую консоль'
    },
    input: 'None',
    output: 'ContextText',
    onData: async function (status, intention, value) {}
});