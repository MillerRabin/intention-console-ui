import IntensionStorage from '/node_modules/intention-storage/browser/main.js';

function resolveParameters(task) {
    const up = task.parameters.filter(p => (p.value === undefined));
    if (up.length == 0) return true;
    const parameter = up[0];
    task.list.waitTypes(parameter.context.name, task);
    iPost.accepted.send({
        text: parameter.context,
        context: task.name,
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

function executeIntensions(task) {
    if (task.intensions == null) return;
    for (let intension of task.textIntensions) {
        task.intensions.push(IntensionStorage.create({
            title: intension.title,
            description: intension.description,
            input: intension.input,
            output: intension.output,
            parameters: task.parameters.map((p) => {
                return { value: p.value.value, type: p.value.name.name }
            }),
            onData: async (status, intension, data) => {
                task.log.push({
                    status: status,
                    intension: intension,
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
        parameters = [],
        structures = [],
        intensions
    }) {
        this.id = IntensionStorage.generateUUID();
        this.structures = structures;
        this.parameters = getParameters(parameters, structures);
        this.name = name;
        this.dependencies = new Set();
        this.onExecute = this.complete;
        this.list = null;
        this.textIntensions = intensions;
        this.intensions = [];
        this.log = [];
    }
    execute() {
        if (!resolveParameters(this)) return;
        executeIntensions(this);
        this.onExecute();
    }
    addDependency(task) {
        this.dependencies.add(task);
    }
    complete() {
        if (this.intensions != null) {
            for (let intension of this.intensions) {
                IntensionStorage.delete(intension);
            }
        }
        this.list.delete(this);
        for (let dep of this.dependencies) {
            this.list.delete(dep);
        }
    }
    searchParameterByType(type) {
        return this.parameters.find(p => (p.context.name == type) && (p.value === undefined));
    }
}

const iPost = IntensionStorage.create({
    title: 'Need post data to console from Tasks',
    description: '<p>Need post data to console from tasks</p>',
    input: 'None',
    output: 'ContextText',
    onData: async function (status, intension, value) {}
});