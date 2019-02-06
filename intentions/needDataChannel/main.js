import IntensionStorage from '/node_modules/intention-storage/browser/main.js';


async function onData() {

}

const gIntension = IntensionStorage.create({
    title: {
        en: 'Need private data channel',
        ru: 'Необходим канал передачи данных'
    },
    input: 'DataChannelServer',
    output: 'DataChannelClient',
    onData: onData
});