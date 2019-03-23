function detectStructure(structures) {
    const ps = structures.reduce((acc, s) => {
        if (s == null) return acc;
        if (s.type == 'task') {
            acc.task.push(s);
            acc.currentTask = (acc.currentTask == null) || (s.level > acc.currentTask.level) ? s : acc.currentTask;
            return acc;
        }
        acc.structures.push(s);
        return acc;
    }, { task: [], structures: [], currentTask: null });

    if (ps.currentTask == null) {
        if (ps.structures.length > 0)
            iTask.accepted.send({
                structures: ps.structures
            });
        return;
    }

    iTask.accepted.send({
        task: ps.currentTask,
        structures: ps.structures
    });
}

function build(structures) {
    return detectStructure([...structures.values()]);
}

let iTask = null;
function init(intentionStorage) {
    iTask = intentionStorage.createIntention({
        title: {
            en: 'Execute tasks',
            ru: 'Отправляю задачи на выполнение'
        },
        input: 'TaskOperationInfo',
        output: 'TaskInfo',
        onData: async function onData(status, intention, value) {}
    });
}

export default {
    init, build
}