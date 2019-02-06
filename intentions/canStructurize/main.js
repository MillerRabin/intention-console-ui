import IntensionStorage from '/node_modules/intention-storage/browser/main.js';
import decision from './decision.js';

IntensionStorage.create({
    title: 'Can structurize user input',
    description: '<p>It`s a primitive built-in structurizer</p>',
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
