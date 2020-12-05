const state = {
    isVisible: false,
    items: [],
    currentIndex: 0,
}

export function handleHistory(event) {
    const { target: { value = '' } } = event;
    if (event.key !== 'ArrowUp') {
        handleHistory(value)
        return false
    }
    state.isVisible = true
    const historyView = document.querySelector('.spotlight-history')
    if (!historyView) {
        return
    }
    historyView.hidden = state.isVisible
}

export function addHistory(value) {
    state.items.push(value)
}

export function getHistoryState() {
    return { ...state }
}
