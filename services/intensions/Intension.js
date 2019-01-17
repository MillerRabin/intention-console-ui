import safe from '../../core/safe.js';
import uuid from '../../core/uuid.js';
import AcceptedIntensions from '../../classes/AcceptedIntensions.js';

async function accept(source, target) {
    try {
        try {
            await source.onAccept(target);
        } catch (e) {
            target.sendError(e);
            throw e;
        }
        try {
            await target.onAccept(source);
        } catch (e) {
            source.sendError(e);
            throw e;
        }
        source.accepted.set(target);
        target.accepted.set(source);
    } catch (e) {
        console.log(e);
    }

}

export default class Intension {
    constructor ({
        title,
        input,
        output,
        onAccept,
        onData,
        onError,
        onClose,
        maxConnections = 1,
        parameters = []
    }) {
        if (safe.isEmpty(title)) throw new Error('Intension must have a title');
        if (safe.isEmpty(input)) throw new Error('Intension must have an input parameters');
        if (safe.isEmpty(output)) throw new Error('Intension must have an output parameters');
        if (typeof(onAccept) != 'function') throw new Error('Intension onAccept must be an async function');
        if (typeof(onData) != 'function') throw new Error('Intension onData must be an async function');
        if (typeof(onError) != 'function') throw new Error('Intension onError must be an async function');
        if (typeof(onClose) != 'function') throw new Error('Intension onClose must be an async function');
        if (isNaN(maxConnections)) throw new Error('MaxConnections mst be a number');
        if (!Array.isArray(parameters)) throw new Error('Parameters must be array');

        this.time = new Date();
        this.title = title;
        this.input = input;
        this.output = output;
        this.origin = window.location.host;
        this.onAccept = onAccept;
        this.onData = onData;
        this.onClose = onClose;
        this.onError = onError;
        this.parameters = parameters;
        this.id = uuid.generate();
        this.accepted = new AcceptedIntensions();
    }
    getKey(reverse = false) {
        return (!reverse) ? `${ this.input } - ${ this.output }` : `${ this.output } - ${ this.input }`;
    }
    accept(intension) {
        return accept(this, intension);
    }
    getParameters() {
        return this.parameters;
    }
    send(data) {
        this.onData(this, data);
    }
    sendError(error) {
        this.onError(this, error);
    }
    close(intension, info) {
        this.onClose(this, info);
        this.accepted.delete(intension);
    }
}