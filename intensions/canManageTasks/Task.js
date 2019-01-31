import IntensionStorage from '/node_modules/intension-storage/browser/main.js';

function resolveParameters(task) {
    const up = task.parameters.filter(p => (p.value == null) && (p.task == null));
    if (up.length == 0) return true;
    const parameter = up[0];
    const pTask = new Task({ name: `Resolve parameter ${ parameter.context.name } for task ${ task.name }`});
    parameter.task = pTask;
    pTask.addDependency(pTask);
    pTask.onExecute = function () {
        iPost.accepted.send({
            text: parameter.context,
            context: {
                name: task.name
            },
            time: new Date()
        });
    };
    task.list.add(pTask);
    return false;
}

function getParameters(parameters) {
    const res = [];
    for (let parameter of parameters) {
        const tp = {
            context: parameter,
            value: null
        };
        res.push(tp);
    }
    return res;
}

export default class Task {
    constructor({
        name,
        parameters = []
    }) {
        this.id = IntensionStorage.generateUUID();
        this.parameters = getParameters(parameters);
        this.name = name;
        this.dependencies = new Set();
        this.onExecute = this.complete;
        this.list = null;
    }
    execute() {
        if (!resolveParameters(this)) return;
        this.onExecute();
    }
    addDependency(task) {
        this.dependencies.add(task);
    }
    complete() {
        this.list.delete(this);
        for (let dep of this.dependencies) {
            this.list.delete(dep);
        }
    }
}

const iPost = IntensionStorage.create({
    title: 'Need post data to console',
    description: '<p>Need post data to console</p>',
    input: 'None',
    output: 'ContextText',
    onData: async function (status, intension, value) {}
});