import IntensionStorage from '/node_modules/intension-storage/browser/main.js';
import WordTree from './WordTree.js';

const gProtocols = new WordTree();

function getProtocolKeys(protocol) {
    const words = protocol.words;
    if (words == null) throw new Error('Protocol must has a words');
    if (typeof(words) == 'string') return [words.toLowerCase()];
    if (typeof(words) == 'object') return Object.values(words).map(v => v.toLowerCase());
    throw new Error('Protocol word format is unsupported');
}

function searchProtocol(recognition) {
    const res = [];
    if (typeof(recognition) == 'string') {
        const val = gProtocols.search(recognition.toLowerCase());
        if (val.length > 0) res.push(...val);
    }

    if (recognition.text != null) {
        const val = gProtocols.search(recognition.text.toLowerCase());
        if (val.length > 0) res.push(...val);
    }

    if (recognition.alternatives != null) {
        for (let alt of recognition.alternatives) {
            const val = gProtocols.search(alt.transcript.toLowerCase());
            if (val.length > 0) res.push(...val);
        }
    }
    return res;
}

function addProtocols(protocols) {
    for (let protocol of protocols) {
        const keys = getProtocolKeys(protocol);
        for (let key of keys) {
            const tp = gProtocols.get(key);
            if (tp != null) throw new Error(`Protocol ${key} already defined`);
            gProtocols.add(key, protocol);
        }
    }
}

IntensionStorage.create({
    title: 'Need protocol information',
    description: '<p>Collects information about protocols</p>',
    input: 'ProtocolInfo',
    output: 'None',
    onData: async (status, intension, value) => {
        if (status == 'data') addProtocols(value);
    }
});

IntensionStorage.create({
    title: 'Can return Protocols by recognition',
    description: '<p>Can return protocol by words</p>',
    input: 'Recognition',
    output: 'Protocols',
    onData: async function (status, intension, value) {
        if (status == 'data') {
            setTimeout(() => {
                const sr = searchProtocol(value);
                intension.send('data', this, sr);
            }, 0);
        }

    }
});