import IntensionStorage from '/node_modules/intension-storage/browser/main.js';
import decision from './decision.js';

IntensionStorage.create({
    title: 'Can structurize user input',
    description: '<p>It`s very primitive structurizer</p>',
    input: 'Recognition',
    output: 'HTMLTextAreaElement',
    onData: async function (status, intension, value) {
        iQuery.accepted.send(value);
    }
});

const iQuery = IntensionStorage.create({
    title: 'Need return entities by words',
    description: '<p>Need return entities by words</p>',
    input: 'Entities',
    output: 'Recognition',
    onData: async (status, intension, value) => {
        if (status == 'data') {
            decision.build(value);
        }
    }
});
