const gQuotes = {
    '\'': 'string',
    '"': 'string',
    '\`': 'string'
};

const gWordsSpaces = {
    ' ': true,
    '\t': true,
    '\n': true,
    '{': false,
    '}': false,
    ',': false,
    '.': false,
    ':': false,
    '(': false,
    ')': false,
    ']': false,
    '[': false,
    ';': false,
    '\'': false,
    '"': false,
    '`': false
};

class Scope {
    constructor({ type, text, index }) {
        this.type = type;
        this.text = text;
        this.outerText = text;
        this.openIndex = index;
        this.closeIndex = text.length;
    }

    getScopes() {
        return this.scopes;
    }

    toHTML() {
        let text = hightlightText(this);
        text = text.replace(/(\r\n|\n|\r)/g,"<br/>");
        return text;
    }
}

class ConstantScope extends Scope {
    constructor({ text, index }) {
        super({type: 'constant', text, index});
        this.name = new WordScope({ text, index });
        this.openIndex = this.name.openIndex;
        this.closeIndex = this.name.closeIndex;
        this.text = this.name.text;
        this.initializer = true;
    }
}

class NewScope extends Scope {
    constructor({ text, index }) {
        super({type: 'new', text, index});
        this.name = new WordScope({ text, index });
        this.openIndex = this.name.openIndex;
        this.closeIndex = this.name.closeIndex;
        this.text = this.name.text;
    }
}


class WordScope extends Scope {
    constructor({ text, index }) {
        super({type: 'word', text, index});
        let st = index;
        let started = false;
        for (let i = index; i < text.length; i++) {
            const b = text[i];
            const ws = getWhiteSpaceSymbol(b);
            if (ws != null) {
                if (!started) {
                    this.firstSymbol = text[index];
                    st = i + 1;
                    continue;
                }
                this.text = text.substr(st, i - st);
                this.outerText = text.substr(index, i - index + 1);
                this.openIndex = st;
                this.closeIndex = i;
                return;
            }
            started = true;
        }
        this.text = text;
        this.outerText = text;
        this.openIndex = st;
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
                this.outerText = text.substr(index, i - index + 1);
                this.text = text.substr(index + 1, i - index - 1);
                this.name = {
                    text: this.outerText
                };
                this.closeIndex = i + 1;
                return;
            }
        }
    }
}

function parseCode({ scope, wordScope, text}) {
    const TokenClass = gCommands[wordScope.text];
    if (TokenClass != null) {
        const cs = new TokenClass({ text, index: wordScope.closeIndex });
        wordScope.for = cs.type;
        if (cs.initializer)
            scope.variables[cs.text] = cs;
        scope.scopes.push(wordScope);
        scope.scopes.push(cs);
        return cs;
    }
    const ns = scope.variables[wordScope.text];
    if (ns != null) {
        wordScope.for = ns.type;
        wordScope.is = 'usage';
        scope.scopes.push(wordScope);
    }
    return wordScope;
}

function parseString({ scope, wordScope}) {
    scope.scopes.push(wordScope);
    return wordScope;
}

class CodeScope extends Scope {
    constructor({ text, index }) {
        super({type: 'code', text, index});
        this.scopes = [];
        this.variables = {};
        this.strings = [];
        for (let i = index; i < text.length; i++) {
            const ws = createScope({ text, index: i });
            let ns = null;
            if (ws.type == 'string') {
                ns = parseString({ scope: this, wordScope: ws});
            } else {
                ns = parseCode({ scope: this, wordScope: ws, text, index});
            }
            i = ns.closeIndex;
        }
    }
}

const gCommands = {
    'const': ConstantScope,
    'new': NewScope,
};

function hightlightText(rootScope) {
    const scopes = rootScope.getScopes();
    scopes.sort(function (a, b) {
        if ((a.openIndex < b.openIndex) && (a.closeIndex <= b.closeIndex)) return -1;
        if ((a.openIndex < b.openIndex) && (a.closeIndex > b.closeIndex)) return 1;
        if (a.openIndex > b.openIndex) return 1;
        return 0;
    });
    let offset = 0;
    let text = rootScope.text;
    for (const scope of scopes) {
        const start = scope.openIndex + offset;
        const end = scope.closeIndex + offset;
        const stext = text.substr(0, start);
        const mtext = text.substr(start, scope.closeIndex - scope.openIndex);
        const etext = text.substr(end);
        const classes = [scope.type];
        if (scope.for != null)
            classes.push(scope.for);
        if (scope.is != null)
            classes.push(scope.is);
        const name = (scope.name != null) ? scope.name.text : scope.text;
        if (mtext != name)
            throw new Error(`${name} and ${mtext} must be equals`);
        text = `${stext}<span class="${classes.join(' ')}">${mtext}</span>${etext}`;
        offset = text.length - rootScope.text.length;
    }
    return text;

}

function getScopeType(wordScope) {
    const sb = wordScope.outerText[0];
    const type = gQuotes[sb];
    if (type == null) return 'code';
    return type;
}

function getWhiteSpaceSymbol(letter) {
    return gWordsSpaces[letter];
}

function createScope(params) {
    const ws = new WordScope(params);
    const type = getScopeType(ws);
    if (type == 'string') {
        return new StringScope(params);
    }
    return ws;
}

class JavaScript extends HTMLElement {
    constructor() {
        super();
    }

    static toHTML(text) {
        const scope = new CodeScope({ text, index: 0 });
        return scope.toHTML();
    }
    connectedCallback() {
        let text = this.innerText;
        this.innerHTML = JavaScript.toHTML(text);
    }
}

customElements.define('highlight-javascript', JavaScript);