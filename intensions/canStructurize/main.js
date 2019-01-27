import IntensionStorage from '/node_modules/intension-storage/browser/main.js';

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
    title: 'Need return Protocols by words',
    description: '<p>Need return protocol by words</p>',
    input: 'Protocols',
    output: 'Recognition',
    onData: async (status, intension, value) => {
        if (status == 'data') {
            const tp = value[0];
            if ((tp == null) || (tp.value == null)) return;
            iPost.accepted.send({
                time: new Date(),
                context: tp.value.name,
                text: 'Протокол распознан'
            })
        }
    }
});

const iPost = IntensionStorage.create({
    title: 'Need post data to console',
    description: '<p>Need post data to console</p>',
    input: 'None',
    output: 'ContextText',
    onData: async function (status, intension, value) {
        console.log(status);
        console.log(intension);
        console.log(value);
    }
});
