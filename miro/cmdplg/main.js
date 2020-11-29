miro.onReady(function() {
    console.info('HERE I AM')

    miro.initialize({
        extensionPoints: {
            bottomBar: {
                title: 'T-plugin',
                svgIcon:
                    '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-import" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 702 1280"><g transform="translate(0,1280) scale(0.1,-0.1)" fill="#000000" stroke="none"><path d="M2980 12201 l-1495 -599 -3 -836 -2 -836 -377 -2 -377 -3 -158 -585 c-87 -322 -206 -760 -264 -975 -58 -214 -118 -437 -134 -495 -164 -598 -170 -622 -170 -734 l0 -106 739 0 740 0 4 -1482 c4 -1540 5 -1581 47 -1928 123 -992 422 -1764 928 -2396 504 -629 1206 -1024 2072 -1164 309 -50 499 -60 1156 -60 l571 0 101 393 c56 215 174 669 262 1007 88 338 214 823 280 1077 l120 461 0 119 0 119 -147 -19 c-126 -16 -222 -19 -648 -20 -525 -2 -623 3 -815 45 -378 81 -577 247 -640 534 -55 253 -53 209 -57 1822 l-4 1492 796 0 795 0 0 1450 0 1450 -795 0 -795 0 0 1435 0 1435 -117 0 -118 -1 -1495 -598z"/></g></svg>',
                onClick: runMe,
            },
        },
    })
    miro.addListener('ESC_PRESSED', termOpenHandler)
})

function runMe() {
    console.info('run[me]')
}

function runYou() {
    console.info('run[you]')
}

let terminalClosePromise = null
function termHandler() {
    if (terminalClosePromise) {
        return termCloseHandler()
    }
    return termOpenHandler()
}
function termCloseHandler() {
    terminalClosePromise.then(() => {
        terminalClosePromise = null
        console.info('TERM CLOSED')
    })
    miro.board.ui.closeBottomPanel()
}
function termOpenHandler() {
    terminalClosePromise = miro.board.ui.openBottomPanel("./terminal.html", {
        width: 2000,
        height: 200,
    })
}
