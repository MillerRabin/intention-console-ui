import localization from '../../core/localization.js';
import dom from '../../core/dom.js';

function hasChilds(node) {
    return (node != null) && (node.childs != null) && (node.childs.length > 0)
}

function getText(contextText) {
    const lang = localization.get();
    return localization.getText(lang, contextText);
}

function enableToggle(treeNode) {
    function toggle() {
        if (!hasChilds(treeNode.data)) return;
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

function buildChilds(node) {
    if (!hasChilds(node)) return null;
    const ul = window.document.createElement('ul');
    if (!node.opened)
        ul.className = 'hide';

    for (let child of node.childs) {
        const li = window.document.createElement('li');
        appendTreeNode(li, child);
        ul.appendChild(li);
    }
    return ul;
}

function buildTreeNode(node) {
    const tNode = window.document.createElement('div');
    tNode.className = 'Tree';
    tNode.data = node;
    const header = buildHeader(node);
    if (header != null) tNode.appendChild(header);
    const childs = buildChilds(node);
    if (childs != null) tNode.appendChild(childs);
    if (node.showRoot && hasChilds(node))
        enableToggle(tNode);
    return tNode;
}

function appendTreeNode(mount, node) {
    const tree = buildTreeNode(node);
    mount.appendChild(tree);
}

class Tree {
    constructor(mount) {
        this._mount = mount;
        this._data = null;
        this._node = null;
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
        this.render()
    }

    get mount() {
        return this._mount;
    }

    set mount(mount) {
        this._mount = mount;
        if (this._node == null) return;
        this._mount.appendChild(this._node);
    }

    render() {
        dom.clearChilds(this._mount);
        if (this._data == null) return;
        appendTreeNode(this._mount, this._data);
    }

    clear(selected) {
        for (let key in selected) {
            if (!selected.hasOwnProperty(key)) continue;
            delete selected[key]
        }
    }

    selectItem(vm, node, selected, checked) {
        const keyVal = (vm.keypath == null) ? 'path' : vm.keypath;
        const key = node[keyVal];
        if (vm.tree.single == true)
            clear(selected);
        if (!checked) {
            Vue.delete(selected, key);
            return;
        }
        Vue.set(selected, key, node);
    }

    setChecked(vm, node, selected, checked) {
        node.checked = checked;
        selectItem(vm, node, selected, checked);
    }

    context(e) {
        if (this.oncontext != null) this.oncontext(this.tree, e);
    }
    setChecked() {
        if (this.selected == null) this.selected = {};
        setChecked(this, this.tree, this.selected, this.tree.checked);
        if (this.onchecked != null) this.onchecked(this.selected, this.tree);
    }
    mover(event) {
        if (this.mouseover != null) this.mouseover(this.tree);
        event.stopPropagation();
        event.preventDefault();
    }
    mounted() {
        this.tree.checked = (this.tree.checked == undefined) ? false: this.tree.checked;
        this.tree.opened = (this.tree.opened == undefined) ? false : this.tree.opened;
    }
}

export default Tree;