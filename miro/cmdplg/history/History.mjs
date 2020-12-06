export const HistoryItem = ({ value, isActive }) => (
    `<li class="cmd-history-item">
        <button class="${isActive ? 'cmd-history-item-active' : ''}">
            ${value}
        </button>
    </li>`
)

export const renderHistory = ({ getState }, element) => {
    let prevItems = []
    return function History() {
        const { viewItems, activeItemIndex } = getState().history
        if (prevItems === viewItems) {
            return
        }
        prevItems = viewItems
        if (viewItems.length === 0) {
            // eslint-disable-next-line no-param-reassign
            element.innerHTML = ''
            return
        }
        // eslint-disable-next-line no-param-reassign
        element.innerHTML = viewItems.map(
            (value, index) => HistoryItem({
                value,
                isActive: index === activeItemIndex,
            }),
        ).join('')
        element.children[activeItemIndex].children[0].focus()
    }
}
