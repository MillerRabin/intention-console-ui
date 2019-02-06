import IntensionStorage from '/node_modules/intention-storage/browser/main.js';


async function onData() {

}

const gIntension = IntensionStorage.create({
    title: 'Need Data Channel',
    input: 'DataChannelServer',
    output: 'DataChannelClient',
    onData: onData
});