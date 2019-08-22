const gQuotes = {
    '\'': 'quote',
    '"': 'quote',
    '\`': 'quote'
};

const gWordBreaks = {
    '{': 'wordBreak',
    '}': 'wordBreak',
    ',': 'wordBreak',
    '.': 'wordBreak',
    ':': 'wordBreak',
    '(': 'wordBreak',
    ')': 'wordBreak',
    ']': 'wordBreak',
    '[': 'wordBreak'
};

const gSpaces = {
    ' ': 'space',
    '\t': 'space',
    '\n': 'lineBreak'
};

class Scope {
    constructor({type, text, index}) {
        this.type = type;
        this.text = text;
        this.openIndex = index;
        this.closeIndex = text.length;
    }
}


class WordScope extends Scope {
    constructor({ text, index }) {
        super({type: 'word', text, index});
        for (let i = index; i < text.length; i++) {
            const b = text[i];
            const ws = getWhiteSpaceSymbol(b);
            if (ws != null) {
                const ei = (i > index) ? i : i + 1;
                this.text = text.substr(index, ei - index);
                this.openIndex = index;
                this.closeIndex = ei;
                this.type = this.getScopeType();
                return;
            }
        }
        this.text = text;
        this.openIndex = index;
        this.type = this.getScopeType();
    }

    getScopeType() {
        const sb = this.text[0];
        const comment = this.text.substr(0, 2);
        if (comment == '//') return 'singleLineComment';
        const type = gQuotes[sb];
        if (type != null) return type;
        const space = gSpaces[sb];
        if (space != null) return space;
        const br = gWordBreaks[sb];
        if (br != null) return br;
        return 'word';
    }
}

class SpaceScope extends Scope {
    constructor({ text, index }) {
        super({type: 'space', text, index});
        this.text = text.substr(index, 1);
        this.openIndex = index;
        this.closeIndex = index + 1;
    }
}

class StringScope extends Scope {
    constructor({ text, index }) {
        super({ type: 'string', text, index });
        const quote = text[index];
        for (let i = index + 1; i < text.length; i++) {
            const b = text[i];
            if (b == '\\') {
                i++;
                continue;
            }
            if (b == quote) {
                this.text= text.substr(index, i - index + 1);
                this.innerText = text.substr(index + 1, i - index - 1);
                this.closeIndex = i + 1;
                return;
            }
        }
    }
}

function getNextWordScope(params) {
    let ws = new WordScope(params);
    while ((ws.type != 'word') && (ws.type != 'endFile')) {
        ws = new WordScope({ text: params.text, index: ws.closeIndex });
    }
    return ws;
}

function getWhiteSpaceSymbol(letter) {
    const wb = gWordBreaks[letter];
    if (wb != null) return wb;
    const qb = gQuotes[letter];
    if (qb != null) return qb;
    const lb = gSpaces[letter];
    if (lb != null) return lb;
    return null;
}

function createScope(params) {
    const ws = new WordScope(params);
    if (ws.type == 'quote')
        return new StringScope(params);
    if (ws.type == 'space')
        return new SpaceScope(params);
    return ws;
}


function start(text) {
    const res = [];
    for (let i = 0; i < text.length; i++) {
        const ws = createScope({ text, index: i });
        res.push(ws);
        i = ws.closeIndex - 1;
    }
    return res;
}

export default {
    start
}