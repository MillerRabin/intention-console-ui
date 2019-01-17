import Intension from './Intension.js';
import OriginMap from '../../classes/OriginMap.js'

const intensions = new Map();

function add(intensions, intension) {
    const key = intension.getKey();
    if (!intensions.has(key)) intensions.set(key, new OriginMap());
    intensions.get(key).set(intension);
}

function deleteIntension(intension) {
    try {
        intension.accepted.close(intension, { message: 'Client closed console'});
    } catch (e) {
        console.log(e);
    }
    const key = intension.getKey();
    const originSet = intensions.get(key);
    if (originSet == null) return;
    originSet.delete(intension);
    if (originSet.size == 0) intensions.delete(key);
}

function create(params) {
    const intension = new Intension(params);
    add(intensions, intension);
    setTimeout(() => {
        dispatchIntensions(intensions, intension)
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
}

function getIntensions() {
    return intensions;
}

export default {
    create: create,
    delete: deleteIntension,
    get: getIntensions
}