import {
    TERMINAL_META, EVAL_CMD_SUCCESS, EVAL_CMD_ERROR,
    terminalMounted,
} from './action.mjs'
import { runMiroCommand } from './miroCommand.mjs'
import { createInnerCommandRunner } from './termCommand.mjs'

const TERM_PREFIX = ' $> '

function createState() {
    let state = initialState
    return {
        getState() {
            return { ...state }
        },
        setState(newState) {
            state = { ...state, ...newState }
        },
    }
}
const initialState = {
    row: 0,
    isLastCmdSuccess: false,
}
const { getState, setState } = createState()

function prompt(term) {
    term.write(`\r\n${TERM_PREFIX}`)
}

function getLineString(term, line) {
    return term.buffer.getLine(line).translateToString()
}

const dataMessageHandler = (term) => (message) => {
    if (!message.data) {
        return
    }
    const action = message.data
    if (!(action.type && action.meta && action.meta === TERMINAL_META)) {
        return
    }
    const event = message.data
    switch (event.type) {
    case EVAL_CMD_SUCCESS: {
        const currentTermRow = term.buffer.cursorY
        setState({ row: currentTermRow, isLastCmdSuccess: true })
        prompt(term)
        break
    }
    case EVAL_CMD_ERROR: {
        term.write(`\r\n [ERROR]: ${event.payload}`)
        const currentTermRow = term.buffer.cursorY
        setState({ row: currentTermRow, isLastCmdSuccess: false })
        prompt(term)
        break
    }
    default: break
    }
}

function initTerminal() {
    miro.broadcastData(terminalMounted())
    const term = new Terminal();
    const runInnerCommand = createInnerCommandRunner(term, { getState, setState })
    term.open(document.getElementById('terminal'));
    term.write(' Power console by \x1B[1;3;31mmiro.com\x1B[0m')
    prompt(term)
    term.focus()
    term.on('key', (key, ev) => {
        const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

        switch (ev.keyCode) {
        case 8: { // DELETE
            // eslint-disable-next-line no-underscore-dangle
            if (term._core.buffer.x > 2) {
                term.write('\b \b');
            }
            break
        }
        case 13: { // ENTER
            const currentTermRow = term.buffer.cursorY
            const rawString = getLineString(term, currentTermRow).split(TERM_PREFIX)[1].trim()
            const isInnerComand = runInnerCommand(rawString)
            if (isInnerComand) {
                setState({ row: currentTermRow, isLastCmdSuccess: true })
                prompt(term)
                break
            }
            const result = runMiroCommand(rawString)
            term.write('\r\n :cmd sent (please wait)')
            break
        }
        default: { // OTHER KEYS
            if (printable) {
                term.write(key)
            }
        }
        }
    })
    miro.addListener('DATA_BROADCASTED', dataMessageHandler(term))
}

document.addEventListener('DOMContentLoaded', () => {
    miro.onReady(() => {
        setTimeout(initTerminal, 500)
    })
})
