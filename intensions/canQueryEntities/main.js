import IntensionStorage from '/node_modules/intension-storage/browser/main.js';
import WordTree from './WordTree.js';

const gEntities = new WordTree();

function getEntityKeys(protocol) {
    const words = protocol.words;
    if (words == null) throw new Error('Entity must has a words');
    if (typeof(words) == 'string') return [words.toLowerCase()];
    if (typeof(words) == 'object') return Object.values(words).map(v => v.toLowerCase());
    throw new Error('Entity word format is unsupported');
}

function searchEntities(recognition) {
    const res = [];
    if (typeof(recognition) == 'string') {
        const val = gEntities.search(recognition.toLowerCase());
        if (val.length > 0) res.push(...val);
    }

    if (recognition.text != null) {
        const val = gEntities.search(recognition.text.toLowerCase());
        if (val.length > 0) res.push(...val);
    }

    if (recognition.alternatives != null) {
        for (let alt of recognition.alternatives) {
            const val = gEntities.search(alt.transcript.toLowerCase());
            if (val.length > 0) res.push(...val);
        }
    }
    return res;
}

function addProtocols(protocols) {
    for (let protocol of protocols) {
        const keys = getEntityKeys(protocol);
        for (let key of keys) {
            const tp = gEntities.get(key);
            if (tp != null) throw new Error(`Protocol ${key} already defined`);
            gEntities.add(key, protocol);
        }
    }
}

IntensionStorage.create({
    title: 'Need entities',
    description: '<p>Collects information about entities</p>',
    input: 'EntitiesInfo',
    output: 'None',
    onData: async (status, intension, value) => {
        if (status == 'data') {
            try {
                addProtocols(value);
            } catch (e) {
                intension.send('error', this, e);
            }
        }
    }
});

IntensionStorage.create({
    title: 'Can return Protocols by recognition',
    description: '<p>Can return protocol by words</p>',
    input: 'Recognition',
    output: 'Entities',
    onData: async function (status, intension, value) {
        if (status == 'data') {
            setTimeout(() => {
                const sr = searchEntities(value);
                intension.send('data', this, sr);
            }, 0);
        }
    }
});