function createTree(name, value ) {
    return { childs: [], name: name, value: value };
}

function formatByOrigin(intensionStorage, query) {
    const hash = new Map();
    for (let [key, originMap] of intensionStorage) {
        for (let [origin, intension] of originMap) {
            if (!hash.has(origin)) hash.set(origin, createTree(origin));
            const item = hash.get(origin);
            item.childs.push(createTree(key, intension))
        }
    }
    return [...hash.values()];
}

function formatByKey(intensionStorage, query) {
    const res = [];
    for (let [key, originMap] of intensionStorage) {
        const item = createTree(key);
        res.push(item);
        for (let [origin, intension] of originMap)
            item.childs.push(createTree(origin, intension));
    }
    return res;
}

function format(intensionStorage, query) {
    query.sort = (query.sort == null) ? 'byKey' : query.sort;
    if (query.sort == 'byOrigin') return formatByOrigin(intensionStorage, query);
    if (query.sort == 'byKey') formatByKey(intensionStorage, query);
    throw new Error(`sort ${ query.sort} is unsupported. Use byOrigin, byKey (default)`);
}

function query(intensionStorage, query) {
    return format(intensionStorage, query)
}

export default {
    query
}


