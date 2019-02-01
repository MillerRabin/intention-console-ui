import IntensionStorage from '/node_modules/intension-storage/browser/main.js';

function detectStructure(structures) {
    const ps = structures.filter(s => (s != null) && (s.value != null) && (s.value.type == 'task'));
    if (ps.length == 0) {
        iTask.accepted.send({
            structures: structures
        });
        return;
    }
    if (ps.length == 1) {
        iTask.accepted.send({
            task: ps[0].value,
            structures: structures
        });
    }
}

function build(structures) {
    return detectStructure([...structures.values()]);
}

const iTask = IntensionStorage.create({
        title: 'Need manage tasks',
            description: '<p>Need create tasks</p>',
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