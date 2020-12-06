export const renderInput = ({ getState }, element) => {
    let prevValue = ''
    let prevFocus = false
    return function Input() {
        const { value, hasFocus } = getState().input
        if (value === prevValue && prevFocus === hasFocus) {
            return
        }
        if (value !== prevValue) {
            prevValue = value
            // eslint-disable-next-line no-param-reassign
            element.value = value
        }
        if (hasFocus) {
            prevFocus = hasFocus
            element.focus()
        }
    }
}
export function mountInput(store, element) {
    store.subscribe(renderInput(store, element))
}
