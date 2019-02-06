function dispatchEvent(event) {
    if (event.keyCode != 13) return;
    event.stopPropagation();
    event.preventDefault();
    const input = event.target;
    if (event.ctrlKey) {
        input.value += '\n';
        return;
    }
    if (input.value == '') return;
    if (!input.disabled) {
        const dataEvent = new Event('data');
        dataEvent.value = input.value;
        input.dispatchEvent(dataEvent);
    }
    input.value = '';
}

function enable(input) {
    input.removeEventListener('keydown', dispatchEvent);
    input.addEventListener('keydown', dispatchEvent);
    input.disabled = false;
    setTimeout(() => {
        input.focus();
    });
}

function disable(input) {
    input.disabled = true;
}

export default {
    enable,
    disable
}