export const STATE_SHOW = 'state'
export const CLEAR_TERM = 'clear'

export const createInnerCommandRunner = (term, { getState }) => (cmdStr) => {
    switch (cmdStr) {
    case CLEAR_TERM: {
        term.clear()
        // term.write(' Power console by \x1B[1;3;31mmiro.com\x1B[0m')
        // prompt(term)
        break
    }
    case STATE_SHOW: {
        const state = getState()
        const stateStr = JSON.stringify(state)
        term.write(`\r\n${stateStr}`)
        break
    }
    default: return false
    }
    return true
}
