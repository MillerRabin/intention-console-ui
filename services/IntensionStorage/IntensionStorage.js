import Intension from './Intension.js';
import OriginMap from './OriginMap.js'
import intensionQuery from './intensionQuery.js';

const intensionStorage = new Map();

function add(intensions, intension) {
    const key = intension.getKey();
    if (!intensions.has(key)) intensions.set(key, new OriginMap());
    intensions.get(key).set(intension);
}

function deleteIntension(intension, message) {
    try {
        intension.accepted.close(intension, { message: message });
    } catch (e) {
        console.log(e);
    }
    const key = intension.getKey();
    const originSet = intensionStorage.get(key);
    if (originSet == null) return;
    originSet.delete(intension);
    if (originSet.size == 0) intensionStorage.delete(key);
}

function create(params) {
    const intension = new Intension(params);
    add(intensionStorage, intension);
    setTimeout(() => {
        dispatchIntensions(intensionStorage, intension)
    });
    return intension;
}

function dispatchIntensions(intensions, intension) {
    const rKey = intension.getKey(true);
    const originMap = intensions.get(rKey);
    if (originMap == null) return;
    for (let [,origin] of originMap) {
        for (let int of origin) {
            try {
                if (int == intension) throw new Error('Intension can`t be equal to itself');
                int.accept(intension);
            } catch (e) {
                console.log(e);
            }
        }
    }
    gIntension.accepted.send(iobj);
}

function query(info) {
    return intensionQuery.query(intensionStorage, info);
}

const iobj = {
    query: query
};

function getIntensions() {
    return intensionStorage;
}

async function onAccept() {
    return iobj;
}

async function onData(intension) {}

async function onError(intension, error) {
    console.log('on Error');
    console.log(intension);
    console.log(error);
}

async function onClose(intension, info) {
    console.log(info);
}

const gIntension = create({
    title: 'can return intensions information',
    input: 'None',
    output: 'InterfaceObject',
    onAccept: onAccept,
    onData: onData,
    onClose: onClose,
    onError: onError
});

export default {
    create: create,
    delete: deleteIntension,
    get: getIntensions
}