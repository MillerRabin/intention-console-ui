const addIndentLetters = {
  '{': 2
};

const subIndentLetters = {
    '}': 2
};

const gColorWords = {
    'const': 'directives',
    'new': 'directives',
    'function': 'directives'
};

function colorWords(words) {
    for(let i = 0; i < words.length; i++) {
        const word = words[i];
        const tClass = gColorWords[word];
        if (tClass == null) continue;
        words[i] = `<span class="${tClass}">${word}</span>`;
    }
}

function createIndent(count) {
    const ia = new Array(count);
    ia.fill('&nbsp;');
    return ia.join('');
}


function checkOffset(offset, letter) {
    const al = addIndentLetters[letter];
    if (al != null) {
        const indent = createIndent(al);
        offset.push(indent);
    }
    const sl = subIndentLetters[letter];
    if (sl != null) {
        const indent = createIndent(al);
        offset.length -= 1;
    }
    return offset
}

function colorLines(lines) {
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const words = line.split(/[\s\t]+/i);
        colorWords(words);
        lines[i] = words.join(' ');
    }
}

function createLines(text) {
    const lines = [];
    let si = 0;
    for (let i = 0; i < text.length; i++) {
        const b = text[i];
        if (b == ';') {
            const line = text.substr(si, (i - si)+ 1);
            lines.push(`${line}<br/>`);
            i++;
            si = i;
        }
    }
    return lines;
}

class JavaScript extends HTMLElement {
    constructor() {
        super();
    }

    static toHTML(text) {
        let rText = text.replace(/[\s\t\n]+/im, ' ');
        const lines = createLines(rText);
        colorLines(lines);
        return lines.join('');
    }
    connectedCallback() {
        let text = this.innerText;
        this.innerHTML = JavaScript.toHTML(text);
    }
}

customElements.define('highlight-javascript', JavaScript);