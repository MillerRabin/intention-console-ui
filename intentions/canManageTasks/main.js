import IntensionStorage from '/node_modules/intention-storage/browser/main.js';
import TaskList from './TaskList.js';
import Task from './Task.js';

const gTasks = new TaskList();

IntensionStorage.create({
    title: 'Can manage tasks',
    description: '<p>Manages tasks</p>',
    input: 'TaskInfo',
    output: 'TaskOperationInfo',
    onData: async function onData(status, intension, value) {
        if (status != 'data') return;
        const mtask = value.task;
        if (mtask != null) {
            const task = new Task({
                name: mtask.name,
                parameters: mtask.parameters,
                structures: value.structures,
                intensions: mtask.intensions
            });
            task.onExecute = function () {
                iPost.accepted.send({
                    text: {
                        ru: 'Выполняю',
                        en: 'Executing job'
                    },
                    context: this.name,
                    time: new Date()
                });
            };
            gTasks.add(task);
        }
        const structures = value.structures;
        if (structures != null) {
            gTasks.dispatchParameters(structures);
        }
    }
});

IntensionStorage.create({
    title: 'Can send storage tasks information',
    description: '<p>Storage tasks information</p>',
    input: 'None',
    output: 'TaskInfo',
    onData: async function onData(status) {
        if (status == 'accept') return gTasks;
    }
});

const iPost = IntensionStorage.create({
    title: 'Need post data to console',
    description: '<p>Need post data to console</p>',
    input: 'None',
    output: 'ContextText',
    onData: async function (status, intension, value) {}
});