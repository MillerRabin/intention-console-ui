import IntensionStorage from '/node_modules/intention-storage/browser/main.js';

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

const iTask = IntensionStorage.create({
        title: {
            en: 'Need possibility to control tasks',
            ru: 'Нужна возможноcть управления задачами'
        },
        input: 'TaskOperationInfo',
        output: 'TaskInfo',
        onData: async function onData(status, intension, value) {
        if (status != 'data') return;
        console.log(intension);
        console.log(value);
    }
});


export default {
    build: build
}