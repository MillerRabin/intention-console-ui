export default class AcceptedIntensions {
    constructor () {
        this.accepted = new Map();
    }
    set(value) {
        this.accepted.set(value.id, value);
    }
    delete(value) {
        this.accepted.delete(value.id);
    }
    send(data) {
        for (let [, intension] of this.accepted) {
            try {
                intension.send(data);
            } catch (e) {
                console.log(e);
            }
        }
    }
    close(sourceIntension, info) {
        for (let [, intension] of this.accepted) {
            try {
                intension.close(sourceIntension, info);
            } catch (e) {
                console.log(e);
            }
        }
        this.accepted.clear();
    }
}