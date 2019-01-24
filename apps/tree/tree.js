import loader from '../../core/loader.js';

loader.application('tree', [async () => {
    function init() {
        return {};
    }

    function clear(selected) {
        for (let key in selected) {
            if (!selected.hasOwnProperty(key)) continue;
                delete selected[key]
        }
    }

    function selectItem(vm, node, selected, checked) {
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


    function setChecked(vm, node, selected, checked) {
        node.checked = checked;
        selectItem(vm, node, selected, checked);
    }

    await loader.createVueTemplate({ path: 'tree.html', id: 'Tree-Template', meta: import.meta });
    const res = {};
    res.Constructor = Vue.component('tree', {
        template: '#Tree-Template',
        data: init,
        props: {
            tree: Object,
            selected: Object,
            onchecked: Function,
            mouseover: Function,
            keypath: String,
            oncontext: Function
        },
        methods: {
            toggle: function () {
                if (!this.hasChilds()) {
                    this.tree.checked = (this.tree.single) ? true: !this.tree.checked;
                    this.setChecked();
                    return;
                }
                Vue.set(this.tree, 'opened', !this.tree.opened);
                this.setChecked();
            },
            context: function (e) {
                if (this.oncontext != null) this.oncontext(this.tree, e);
            },
            setChecked: function () {
                if (this.selected == null) this.selected = {};
                setChecked(this, this.tree, this.selected, this.tree.checked);
                if (this.onchecked != null) this.onchecked(this.selected, this.tree);
            },
            hasChilds: function () {
                return (this.tree.childs != null) && (this.tree.childs.length > 0)
            },
            mover: function (event) {
                if (this.mouseover != null) this.mouseover(this.tree);
                event.stopPropagation();
                event.preventDefault();
            }
        },
        mounted: function () {
            this.tree.checked = (this.tree.checked == undefined) ? false: this.tree.checked;
            this.tree.opened = (this.tree.opened == undefined) ? false : this.tree.opened;
        }
    });
    return res;
}]);

