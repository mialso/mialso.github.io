import { terminalMounted } from './action.mjs'

document.addEventListener('DOMContentLoaded', () => {
    miro.onReady(() => {
        miro.broadcastData(terminalMounted())
        const term = new Terminal();
        term.open(document.getElementById('terminal'));
        term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
        term.on('key', (key, ev) => {
            console.log(key.charCodeAt(0))
            if (key.charCodeAt(0) === 13) {
                term.write('\n')
            }
            term.write(key)
        })
    })
})
