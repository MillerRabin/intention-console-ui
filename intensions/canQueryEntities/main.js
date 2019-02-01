import IntensionStorage from '/node_modules/intension-storage/browser/main.js';
import WordTree from './WordTree.js';
import typeAutodetect from './typeAutodetect.js';

const gEntities = new WordTree();

function getEntityKeys(protocol) {
    const words = protocol.words;
    if (words == null) throw new Error('Entity must has a words');
    if (typeof(words) == 'string') return [words.toLowerCase()];
    if (typeof(words) == 'object') return Object.values(words).map(v => v.toLowerCase());
    throw new Error('Entity word format is unsupported');
}

function appendResults(resMap, values) {
    for (let val of values) {
        let pData = resMap.get(val.value);
        if (pData == null) {
            pData = Object.assign({}, val);
            pData.parameters = new Map();
            resMap.set(val.value, pData);
        }
        if (val.parameters != null) {
            const key = val.parameters.join(' ');
            pData.parameters.set(key, val);
        }
    }
}

function searchEntities(recognition) {
    const res = new Map();
    if (typeof(recognition) == 'string') {
        const vals = gEntities.search(recognition.toLowerCase());
        appendResults(res, vals);
    }

    if (recognition.text != null) {
        const vals = gEntities.search(recognition.text.toLowerCase());
        if (vals.length > 0) appendResults(res, vals);
    }

    if (recognition.alternatives != null) {
        for (let alt of recognition.alternatives) {
            const vals = gEntities.search(alt.transcript.toLowerCase());
            appendResults(res, vals);
        }
    }

    return res;
}

function addEntities(entities) {
    for (let entity of entities) {
        const keys = getEntityKeys(entity);
        for (let key of keys) {
            const tp = gEntities.get(key);
            if (tp != null) throw new Error(`Protocol ${key} already defined`);
            gEntities.add(key, entity);
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
                addEntities(value);
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
                if (sr.size > 0)
                    intension.send('data', this, sr);
            }, 0);
        }
    }
});