import { terminalMounted } from './action.mjs'
import { giphyAdd } from './giphyAction.mjs'
import { imageAdd } from './imageMeAction.mjs'
import { startTimer } from './miroCommand.mjs'
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

function runMiroCommand(cmdStr) {
    console.info(`[TERM]: got miro command: ${cmdStr}`)

    const words = cmdStr.split(' ');
    const app = words[0];

    switch (app) {
    case 'giphy': {
        const [_, ...others] = words;
        miro.broadcastData(giphyAdd(others.join(' ')));
        return true
    }
    case 'image': {
        const [_, ...others] = words;
        miro.broadcastData(imageAdd(others.join(' ')));
        return true
    }
    case 'timer': {
        const timeSec = 100
        miro.broadcastData(startTimer(timeSec))
        return true
    }
    default: {
        return false
    }
    }
}

function prompt(term) {
    term.write(`\r\n${TERM_PREFIX}`)
}

function getLineString(term, line) {
    return term.buffer.getLine(line).translateToString()
}

function initTerminal() {
    miro.broadcastData(terminalMounted())
    const { getState, setState } = createState()
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
            const result = runInnerCommand(rawString) || runMiroCommand(rawString)
            setState({ row: currentTermRow, isLastCmdSuccess: result })
            prompt(term)
            break
        }
        default: { // OTHERS
            if (printable) {
                term.write(key)
            }
        }
        }
    })
}

document.addEventListener('DOMContentLoaded', () => {
    miro.onReady(() => {
        setTimeout(initTerminal, 500)
    })
})
