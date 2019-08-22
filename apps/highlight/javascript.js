import tokenize from './tokenize.js';

class Scope {
    constructor ({ scopes, index, type}) {
        const scope = scopes[index];
        this.openIndex = scope.openIndex;
        this.closeIndex = scope.closeIndex;
        this.scopes = scopes;
        this.type = type;
    }
}

class CodeScope extends Scope {
    constructor ({ scopes, index}) {
        super({scopes, index});
        this.variables = {};
        this.codeScopes = [];
        for (let i = 0; i < scopes.length; i++) {
            const scope = scopes[i];
            if (scope.type == 'space') continue;
            if (scope.type == 'string') {
                this.codeScopes.push(scope);
                continue;
            }

            const TokenClass = gCommands[scope.text];
            if (TokenClass != null) {
                const cs = new TokenClass({ scopes, index: i});
                scope.for = cs.type;
                if (cs.initializer)
                    this.variables[scope.text] = cs;
                this.codeScopes.push(scope);
                this.codeScopes.push(cs);
                if (cs.next != null)
                    i = cs.next - 1;
            } else {
                const ns = this.variables[scope.text];
                if (ns != null) {
                    scope.for = ns.type;
                    scope.is = 'usage';
                    scope.codeScopes.push(scope);
                }
            }

        }
    }

    toHTML(text) {
        let rText = highlightText(this, text);
        rText = rText.replace(/(\r\n|\n|\r)/g,"<br/>");
        return rText;
    }
}

class ConstantScope extends Scope {
    constructor({ scopes, index }) {
        super({type: 'constant', scopes, index});
        let nIndex = getNextWordScopeInLineIndex(scopes, index + 1);
        if (nIndex == -1)
            throw new Error('constant needs a name');
        const sScope = scopes[index];
        this.name = scopes[nIndex];
        this.openIndex = this.name.openIndex;
        this.closeIndex = this.name.closeIndex;
        this.initializer = true;
        this.scopes = scopes.slice(index, nIndex + 1);
    }
}

class NewScope extends Scope {
    constructor({ scopes, index }) {
        super({type: 'new', scopes, index});
        let nIndex = getNextWordScopeInLineIndex(scopes, index + 1);
        if (nIndex == -1)
            throw new Error('new needs a Class');
        this.name = scopes[nIndex];
        this.openIndex = this.name.openIndex;
        this.closeIndex = this.name.closeIndex;
        this.scopes = scopes.slice(index, nIndex + 1);
    }
}

class SingleLineCommentScope extends Scope {
    constructor({ scopes, index }) {
        super({ type: 'singleLineComment', scopes, index });
        const sScope = scopes[index];
        for (let i = index + 1; i < scopes.length; i++) {
            const scope = scopes[i];
            if (scope.type == 'lineBreak') {
                this.openIndex = sScope.closeIndex;
                this.closeIndex = scope.openIndex;
                this.text = buildText(scopes, index + 1, i);
                this.scopes = scopes.slice(index, i);
                this.next = i;
                return;
            }
        }
        const lScope = scopes[scopes.length - 1];
        this.closeIndex = lScope.closeIndex;
    }
}

function getNextWordScopeInLineIndex(scopes, index) {
    for (let i = index; i < scopes.length; i++) {
        const scope = scopes[i];
        if (scope.type == 'lineBreak') return -1;
        if (scope.type == 'word') return i;
    }
    return -1;
}

function highlightText(rootScope, text) {
    const scopes = rootScope.codeScopes;
    scopes.sort(function (a, b) {
        if ((a.openIndex < b.openIndex) && (a.closeIndex <= b.closeIndex)) return -1;
        if ((a.openIndex < b.openIndex) && (a.closeIndex > b.closeIndex)) return 1;
        if (a.openIndex > b.openIndex) return 1;
        return 0;
    });
    let offset = 0;
    let rText = text;
    for (const scope of scopes) {
        if (scope.text == '"Нужен лимонад"')
            console.log('gotcha');
        const start = scope.openIndex + offset;
        const end = scope.closeIndex + offset;
        const stext = rText.substr(0, start);
        const mtext = rText.substr(start, scope.closeIndex - scope.openIndex);
        const etext = rText.substr(end);
        const classes = [scope.type];
        if (scope.for != null)
            classes.push(scope.for);
        if (scope.is != null)
            classes.push(scope.is);
        const name = (scope.name != null) ? scope.name.text : scope.text;
        if (mtext != name)
            throw new Error(`${name} and ${mtext} must be equals`);
        rText = `${stext}<span class="${classes.join(' ')}">${mtext}</span>${etext}`;
        offset = rText.length - text.length;
    }
    return rText;
}

function buildText(scopes, from, to) {
    const res = [];
    for (let i = from; i < to; i++) {
        res.push(scopes[i].text);
    }
    return res.join('');
}

const gCommands = {
    'const': ConstantScope,
    'new': NewScope,
    '//': SingleLineCommentScope
};

class JavaScript extends HTMLElement {
    constructor() {
        super();
    }

    static toHTML(text) {
        const scopes = tokenize.start(text);
        const cs = new CodeScope({ scopes: scopes, index: 0 });
        return cs.toHTML(text);
    }
    connectedCallback() {
        let text = this.innerText;
        this.innerHTML = JavaScript.toHTML(text);
    }
}

customElements.define('highlight-javascript', JavaScript);