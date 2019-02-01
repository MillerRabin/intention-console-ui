function createBranch(value) {
    return {
        value: value,
        branch: new Map()
    }
}

function removeStopWords(word) {
    return word.length > 1;
}

function recursiveSearch(root, words, res, current) {
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const branch = root.branch.get(word);
        if (branch == null) continue;
        const cw = (current == null) ? { words: [], value: null } : current;
        cw.words.push(word);
        cw.value = branch.value;
        let item = null;
        if (cw.value != null) {
            item = {
                words: cw.words,
                value: cw.value
            };
            res.push(item);
        }
        const nwords = words.filter(v => v != word);
        if (nwords.length == 0) return;
        if (item != null) item.parameters = nwords;
        recursiveSearch(branch, nwords, res, cw);
    }
}

export default class WordTree {
    constructor() {
        this.root = createBranch(null);
    }
    add(text, value) {
        const words = WordTree.removeStopWords(text);
        let root = this.root;
        for (let word of words) {
            if (!root.branch.has(word)) root.branch.set(word, createBranch(null));
            root = root.branch.get(word);
        }
        if (root.value != null) throw new Error('value already exists');
        root.value = value;
    }
    get(text) {
        const words = WordTree.removeStopWords(text);
        let root = this.root;
        for (let word of words) {
            if (!root.branch.has(word)) return null;
            root = root.branch.get(word);
        }
        return root.value;
    }
    search(text) {
        const words = WordTree.removeStopWords(text);
        const res = [];
        recursiveSearch(this.root, words, res, null);
        return res;
    }
    static removeStopWords(text) {
        return text.split(/\s+/).filter(removeStopWords);
    }
}