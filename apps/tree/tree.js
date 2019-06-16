import localization from '../../core/localization.js';
import dom from '../../core/dom.js';

function hasChilds(node) {
    return (node != null) && (node.childs != null) && (node.childs.length > 0)
}

function getText(contextText) {
    const lang = localization.get();
    return localization.getText(lang, contextText);
}

function call(tree, handler, data) {
    if (handler == null) return;
    handler.apply(tree, [data]);
}

function enableToggle(tree, treeNode) {
    function toggle() {
        if (!hasChilds(treeNode.data)) {
            return call(tree, tree.onclick, treeNode.data);
        }
        treeNode.data.opened = !treeNode.data.opened;
        const aClass = treeNode.data.opened ? 'icon-minus-squared-alt' : 'icon-plus-squared-alt';
        plusBtn.classList.remove('icon-minus-squared-alt');
        plusBtn.classList.remove('icon-plus-squared-alt');
        plusBtn.classList.add(aClass);
        if (childs == null) return;
        childs.classList.remove('hide');
        if (!treeNode.data.opened)
            childs.classList.add('hide');
    }

    const btns = treeNode.querySelectorAll(':scope > .title > button');
    const plusBtn = treeNode.querySelector(':scope > .title > button.plus');
    const childs =  treeNode.querySelector(':scope > ul');
    for (let btn of btns) {
        btn.onclick = toggle;
    }
}


function buildHeader(node) {
    if ((node == null) || (node.showRoot == false)) return null;
    const btnClasses = ['plus'];
    const plus = node.opened ? 'icon-minus-squared-alt' : 'icon-plus-squared-alt';
    btnClasses.push(plus);
    if (hasChilds(node))  btnClasses.push('visible');
    const template = [
        `<button class="${btnClasses.join(' ')}"></button>`,
        (node.single) ? '' : '<input type="checkbox" title="Выделить"/>',
        `<button class="${node.value ? 'intention' : ''}">`,
            (node.value != null) ? `<span>${getText(node.value.title)}</span>` : '',
            `<span>${node.name}</span>`,
        `</button>`,
    ];
    const title = window.document.createElement('div');
    title.className = 'title';
    title.innerHTML = template.join('');
    return title;
}

function buildChilds(tree, node) {
    if (!hasChilds(node)) return null;
    const ul = window.document.createElement('ul');
    if (!node.opened)
        ul.className = 'hide';

    for (let child of node.childs) {
        const li = window.document.createElement('li');
        appendTreeNode(tree, li, child);
        ul.appendChild(li);
    }
    return ul;
}

function buildTreeNode(tree, node) {
    const tNode = window.document.createElement('div');
    tNode.className = 'Tree';
    tNode.data = node;
    const header = buildHeader(node);
    if (header != null) tNode.appendChild(header);
    const childs = buildChilds(tree, node);
    if (childs != null) tNode.appendChild(childs);
    if (node.showRoot)
        enableToggle(tree, tNode);
    return tNode;
}

function appendTreeNode(tree, mount, node) {
    const nodes = buildTreeNode(tree, node);
    mount.appendChild(nodes);
}

class Tree {
    constructor(mount) {
        this._mount = mount;
        this._data = null;
        this._node = null;
        this._onclick = null;
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
        this.render()
    }

    get onclick() {
        return this._onclick;
    }

    set onclick(value) {
        this._onclick = value;
    }

    get mount() {
        return this._mount;
    }

    set mount(mount) {
        this._mount = mount;
        if (this._node == null) return;
        this._mount.appendChild(this, this._node);
    }

    render() {
        dom.clearChilds(this._mount);
        if (this._data == null) return;
        appendTreeNode(this, this._mount, this._data);
    }
}

export default Tree;