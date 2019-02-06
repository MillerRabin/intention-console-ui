import IntensionStorage from '/node_modules/intention-storage/browser/main.js';
import TaskList from './TaskList.js';
import Task from './Task.js';

const gTasks = new TaskList();

IntensionStorage.create({
    title: {
        en: 'Can manage tasks',
        ru: 'Управляю задачами'
    },
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
    title: {
        en: 'Can send storage tasks information',
        ru: 'Рассылаю информацию о задачах'
    },
    input: 'None',
    output: 'TaskInfo',
    onData: async function onData(status) {
        if (status == 'accept') return gTasks;
    }
});

const iPost = IntensionStorage.create({
    title: {
        en: 'Sends task statuses to user console',
        ru: 'Отправляю статусы по задачам в пользовательсую консоль'
    },
    input: 'None',
    output: 'ContextText',
    onData: async function (status, intension, value) {}
});