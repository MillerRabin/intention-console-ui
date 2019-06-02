function clearChilds(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

export default {
    clearChilds
}