import { spotlightMounted } from './action.mjs'
import { runMiroCommand } from './miroCommand.mjs'

function createState() {
    let state = {}
    return {
        getState() {
            return { ...state }
        },
        setState(newState) {
            state = { ...state, ...newState }
        },
    }
}

const handleSearch = (e) => {
    console.log(e)

    if (e.key === 'Enter') {
        runMiroCommand(e.target.value);
    }
}

function initSpothlight() {
    miro.broadcastData(spotlightMounted());
    const { getState, setState } = createState();
    
    const $container = document.getElementById('js-spotlight');
    const $search = $container.getElementsByTagName('input').item(0);

    $search.addEventListener('keypress', handleSearch);

    $container.classList.add('spotlight--on')
}

document.addEventListener('DOMContentLoaded', () => {
    miro.onReady(() => {
        setTimeout(initSpothlight, 500)
    })
})
