import { compose } from './util.mjs'
import {
    SPOTLIGHT_MOUNTED,
    UNMOUNT_SPOTLIGHT,
    TERMINAL_META,
    TERMINAL_MOUNTED,
    SET_UI_TYPE,
    evalCmdError,
    evalCmdSuccess,
} from './action.mjs'
import { GIPHY_ADD } from './giphyAction.mjs'
import { runGiphy } from './giphyRunner.mjs'
import { GIPHYS_CREATE, GIPHYS_SEARCH } from './giphysAction.mjs'
import { runGiphys } from './giphysRunner.mjs'
import { IMAGE_ADD } from './imageMeAction.mjs'
import { runImageMe } from './imageMeRunner.mjs'
import { RUN_MARIO } from './marioAction.mjs'
import { openMario } from './marioRunner.mjs'
import { createImageByUrl } from './miroFunctions.mjs'
import { EVAL_TIMER } from './timerAction.mjs'
import { evalTimerCmd } from './timerRunner.mjs'

const ENABLED = 'ENABLED'
const DISABLED = 'DISABLED'
const MOUNTED = 'MOUNTED'
const IN_PROGRESS = 'IN_PROGRESS'
const UNMOUNTED = 'UNMOUNTED'
const X_TERM = 'X_TERM'

const TERMINAL_MODAL = {
    HEIGHT: 440,
    URL: '/miro/cmdplg/terminal.html',
    WIDTH: 760,
}

const SPOTLIGHT_MODAL = {
    HEIGHT: 1000,
    URL: '/miro/cmdplg/spotlight.html',
    WIDTH: 1000,
}

const defaultState = {
    mode: DISABLED,
    status: UNMOUNTED,
    isDebug: true,
    uiType: SPOTLIGHT_MODAL,
}

function createState(initialState = {}) {
    let state = { ...defaultState, ...initialState }
    return {
        setState(newState) {
            state = { ...state, ...newState }
            if (state.isDebug) {
                console.info('new state:')
                console.log(state)
            }
        },
        getState() {
            return { ...state }
        },
    }
}

const { setState, getState } = createState()

miro.onReady(() => {
    console.info('HERE I AM')
    console.log(getState())

    miro.initialize({
        extensionPoints: {
            bottomBar: {
                title: 'T-plugin',
                svgIcon:
                    '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-import" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 702 1280"><g transform="translate(0,1280) scale(0.1,-0.1)" fill="#000000" stroke="none"><path d="M2980 12201 l-1495 -599 -3 -836 -2 -836 -377 -2 -377 -3 -158 -585 c-87 -322 -206 -760 -264 -975 -58 -214 -118 -437 -134 -495 -164 -598 -170 -622 -170 -734 l0 -106 739 0 740 0 4 -1482 c4 -1540 5 -1581 47 -1928 123 -992 422 -1764 928 -2396 504 -629 1206 -1024 2072 -1164 309 -50 499 -60 1156 -60 l571 0 101 393 c56 215 174 669 262 1007 88 338 214 823 280 1077 l120 461 0 119 0 119 -147 -19 c-126 -16 -222 -19 -648 -20 -525 -2 -623 3 -815 45 -378 81 -577 247 -640 534 -55 253 -53 209 -57 1822 l-4 1492 796 0 795 0 0 1450 0 1450 -795 0 -795 0 0 1435 0 1435 -117 0 -118 -1 -1495 -598z"/></g></svg>',
                onClick: termHandler,
            },
        },
    })
    miro.addListener('ESC_PRESSED', termHandler)
    miro.addListener('DATA_BROADCASTED', termEventBus)
    toggleMode()
})

function toggleMode() {
    const state = getState()
    switch (state.mode) {
    case DISABLED: {
        setState({ mode: ENABLED })
        miro.showNotification('T-plugin: ENABLED')
        break
    }
    default: {
        setState(defaultState)
        miro.showNotification('T-plugin: DISABLED')
        break
    }
    }
}
window.tPluginToggle = toggleMode

let terminalClosePromise = null
function termHandler() {
    const state = getState()
    if (state.mode === DISABLED) {
        return
    }
    switch (state.status) {
    case UNMOUNTED: {
        termOpenHandler()
        break
    }
    case IN_PROGRESS: {
        // TODO force stop, reason?
        // for now - do nothing while in progress
        break
    }
    case MOUNTED: {
        termCloseHandler()
        break
    }
    default: break
    }
}

function termCloseHandler() {
    setState({ status: IN_PROGRESS })
    if (terminalClosePromise) {
        terminalClosePromise.then(() => {
            terminalClosePromise = null
            setState({ status: UNMOUNTED })
        })
    } else {
        setState({ status: UNMOUNTED })
    }
    miro.board.ui.closeModal()
}

function termOpenHandler() {
    const CONFIG = getState().uiType;

    setState({ status: IN_PROGRESS }) // actuall MOUNTED comes from terminal itself later
    terminalClosePromise = miro.board.ui.openModal(CONFIG.URL, {
        width: CONFIG.WIDTH,
        height: CONFIG.HEIGHT,
    });
}

function handleCommandResult(result) {
    if (result === true) {
        // SUCCESS
        miro.broadcastData(evalCmdSuccess())
        return
    }
    if (typeof result === 'string') {
        // ERROR, message back to those who interested (e.g. terminal)
        miro.broadcastData(evalCmdError(result))
    }
}

function termEventBus(message) {
    if (!message.data) {
        return
    }
    const action = message.data
    if (!(action.type && action.meta && action.meta === TERMINAL_META)) {
        return
    }
    switch (action.type) {
    case TERMINAL_MOUNTED:
    case SPOTLIGHT_MOUNTED: {
        setState({ status: MOUNTED })
        break
    }
    case UNMOUNT_SPOTLIGHT: {
        termCloseHandler();
        break;
    }
    case SET_UI_TYPE: {
        if (action.payload === X_TERM) {
            const { uiType } = getState()
            if (uiType === TERMINAL_MODAL) {
                break
            }
            setState({ uiType: TERMINAL_MODAL })
        } else {
            const { uiType } = getState()
            if (uiType === SPOTLIGHT_MODAL) {
                break
            }
            setState({ uiType: SPOTLIGHT_MODAL })
        }
        termCloseHandler();
        setTimeout(termOpenHandler, 300)
        break
    }
    case GIPHY_ADD: {
        compose(
            handleCommandResult,
            runGiphy,
        )(action)
        break
    }
    case GIPHYS_SEARCH: {
        compose(
            handleCommandResult,
            runGiphys,
        )(action)
        break
    }
    case GIPHYS_CREATE: {
        createImageByUrl(action.payload.url, action.payload.url.keyword)
        break
    }
    case IMAGE_ADD: {
        compose(
            handleCommandResult,
            runImageMe,
        )(action)
        break
    }
    case RUN_MARIO: {
        openMario(action)
        handleCommandResult(true)
        break
    }
    case EVAL_TIMER: {
        compose(
            handleCommandResult,
            evalTimerCmd(miro.broadcastData),
        )(action.payload)
        break
    }
    default: break
    }
}
