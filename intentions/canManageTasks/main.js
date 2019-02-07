import IntentionStorage from '/node_modules/intention-storage/browser/main.js';
import TaskList from './TaskList.js';
import Task from './Task.js';

const updatedTasks = new Map();
let gStatsInterval = 5000;
let gStatsTimeout = null;


const gTasks = new TaskList({
    onUpdate: function (task, status) {
        updatedTasks.set(task.id, {
            status: status,
            task: task.toObject()
        })
    },
    onPost: function (message) {
        iPost.accepted.send(message);
    }
});

IntentionStorage.create({
    title: {
        en: 'Can manage tasks',
        ru: 'Управляю задачами'
    },
    input: 'TaskInfo',
    output: 'TaskOperationInfo',
    onData: async function onData(status, intention, value) {
        if (status != 'data') return;
        const mtask = value.task;
        if (mtask != null) {
            const task = new Task({
                name: mtask.name,
                key: mtask.key,
                parameters: mtask.parameters,
                structures: value.structures,
                intentions: mtask.intentions
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

const iObj = {
    query: function () {
        return gTasks.query();
    }
};

const iSend = IntentionStorage.create({
    title: {
        en: 'Can send storage tasks information',
        ru: 'Рассылаю информацию о задачах'
    },
    input: 'None',
    output: 'TaskInfo',
    onData: async function onData(status) {
        if (status == 'accept') return iObj;
    }
});

const iPost = IntentionStorage.create({
    title: {
        en: 'Sends task statuses to user console',
        ru: 'Отправляю статусы по задачам в пользовательсую консоль'
    },
    input: 'None',
    output: 'ContextText',
    onData: async function (status, intention, value) {}
});

function sendStats() {
    try {
        if (updatedTasks.size == 0) return;
        iObj.updatedTasks = [...updatedTasks.values()];
        iSend.accepted.send(iObj);
    }
    catch (e) {
        console.log(e);
    }
    finally {
        updatedTasks.clear();
        delete iObj.updatedTasks;
        setTimeout(sendStats, gStatsInterval);
    }
}

function enableStats() {
    disableStats();
    gStatsTimeout = setTimeout(sendStats, gStatsInterval);
}

function disableStats() {
    clearTimeout(gStatsTimeout);
}

function setStatsInterval(interval) {
    disableStats();
    gStatsInterval = interval;
    enableStats();
}

enableStats();

export default {
  enableStats: enableStats,
  disableStats: disableStats,
  setStatsInterval: setStatsInterval
}