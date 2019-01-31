function createBranch(value) {
    return {
        value: value,
        branch: new Map()
    }
}

function removeStopWords(word) {
    return word.length > 2;
}

function recursiveSearch(root, words, res, current) {
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const branch = root.branch.get(word);
        if (branch == null) continue;
        const cw = (current == null) ? { words: [], value: null } : current;
        cw.words.push(word);
        cw.value = branch.value;
        if (cw.value != null) {
            res.push({
                words: cw.words,
                value: cw.value
            });
        }
        const nwords = words.filter(v => v != word);
        if (nwords.length == 0) return;
        recursiveSearch(branch, nwords, res, cw);
    }
}

export default class WordTree {
    constructor() {
        this.root = createBranch(null);
    }
    add(text, value) {
        const words = text.split(/\s+/).filter(removeStopWords);
        let root = this.root;
        for (let word of words) {
            if (!root.branch.has(word)) root.branch.set(word, createBranch(null));
            root = root.branch.get(word);
        }
        if (root.value != null) throw new Error('value already exists');
        root.value = value;
    }
    get(text) {
        const words = text.split(/\s+/).filter(removeStopWords);
        let root = this.root;
        for (let word of words) {
            if (!root.branch.has(word)) return null;
            root = root.branch.get(word);
        }
        return root.value;
    }
    search(text) {
        const words = text.split(/\s+/).filter(removeStopWords);
        const res = [];
        recursiveSearch(this.root, words, res, null);
        return res;
    }

}