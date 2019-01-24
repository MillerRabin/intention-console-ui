import IntensionStorage from '/node_modules/intension-storage/browser/main.js';


async function onData() {

}

const gIntension = IntensionStorage.create({
    title: 'need Data Channel',
    input: 'DataChannelServer',
    output: 'DataChannelClient',
    onData: onData
});