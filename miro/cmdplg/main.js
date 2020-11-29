const ENABLED = 'ENABLED'
const DISABLED = 'DISABLED'
const MOUNTED = 'MOUNTED'
const IN_PROGRESS = 'IN_PROGRESS'
const UNMOUNTED = 'UNMOUNTED'

const defaultState = {
    mode: DISABLED,
    status: UNMOUNTED,
    isDebug: true,
}

function createState(initialState = {}) {
    let state = { ...defaultState,  ...initialState }
    return {
        setState(newState) {
            state = { ...state, newState }
            if (state.isDebug) {
                console.info(`new state:`)
                console.log(state)
            }
        },
        getState() {
            return { ...state }
        }
    }
}

const { setState, getState } = createState()

miro.onReady(function() {
    console.info('HERE I AM')
    console.log(getState())

    miro.initialize({
        extensionPoints: {
            bottomBar: {
                title: 'T-plugin',
                svgIcon:
                    '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-import" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 702 1280"><g transform="translate(0,1280) scale(0.1,-0.1)" fill="#000000" stroke="none"><path d="M2980 12201 l-1495 -599 -3 -836 -2 -836 -377 -2 -377 -3 -158 -585 c-87 -322 -206 -760 -264 -975 -58 -214 -118 -437 -134 -495 -164 -598 -170 -622 -170 -734 l0 -106 739 0 740 0 4 -1482 c4 -1540 5 -1581 47 -1928 123 -992 422 -1764 928 -2396 504 -629 1206 -1024 2072 -1164 309 -50 499 -60 1156 -60 l571 0 101 393 c56 215 174 669 262 1007 88 338 214 823 280 1077 l120 461 0 119 0 119 -147 -19 c-126 -16 -222 -19 -648 -20 -525 -2 -623 3 -815 45 -378 81 -577 247 -640 534 -55 253 -53 209 -57 1822 l-4 1492 796 0 795 0 0 1450 0 1450 -795 0 -795 0 0 1435 0 1435 -117 0 -118 -1 -1495 -598z"/></g></svg>',
                onClick: toggleMode,
            },
        },
    })
    miro.addListener('ESC_PRESSED', termHandler)
    miro.addListener('DATA_BROADCASTED', termEventBus)
})

function toggleMode() {
    const state = getState()
    switch(state.mode) {
        case DISABLED: {
            setState({ mode: ENABLED })
            miro.showNotification('T-plugin: ENABLED')
            break
        }
        default: {
            setState({ mode: DISABLED })
            miro.showNotification('T-plugin: DISABLED')
        }
    }
}

let terminalClosePromise = null
function termHandler() {
    const state = getState()
    if (state.mode === DISABLED) {
        return
    }
    switch(state.status) {
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
    miro.board.ui.closeBottomPanel()
}

function termOpenHandler() {
    setState({ status: IN_PROGRESS }) // actuall MOUNTED comes from terminal itself later
    terminalClosePromise = miro.board.ui.openBottomPanel(
        "./terminal.html",
        {
            width: 2000,
            height: 200,
        },
    )
}

function termEventBus(action) {
    if (!(action.type && action.meta && action.meta === TERMINAL_META)) {
        return
    }
    switch(action.type) {
        case TERMINAL_MOUNTED: {
            setState({ status: MOUNTED })
            break
        }
        default: break
    }
}
