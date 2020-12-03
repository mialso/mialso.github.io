import { spotlightMounted, unmountSpotlight } from './action.mjs'
import { runMiroCommand } from './miroCommand.mjs'

const ACTION_CONFIG = {
    CONFETTI: {
        label: 'Confetti',
        hint: 'confetti <span>duration in seconds</span>',
        shouldCloseTerminal: true,
    },
    GIPHY: {
        label: 'Giphy',
        hint: 'giphy <span>phrase</span>',
        shouldCloseTerminal: true,
    },
    IMAGE: {
        label: 'Image',
        hint: 'image <span>phrase</span>',
        shouldCloseTerminal: true,
    },
    MARIO: {
        label: 'Mario',
        hint: 'mario <span>start/add</span>',
        shouldCloseTerminal: false,
    },
    TIMER: {
        label: 'Timer',
        hint: 'timer <span>duration</span> <span>action (optional)</span>',
        shouldCloseTerminal: true,
    },
}
const DEFAULT_CONFIG = {
    hint: 'What do you want to do?',
    shouldCloseTerminal: false,
}
const SUPPORTED_ACTIONS = Object.keys(ACTION_CONFIG);


const getAction = (value) => value.split(' ')[0].toUpperCase();

const renderHtml = (template, id, replace = false) => {
    const element = document.getElementById(id);
    const html = template.trim();

    if (!element) {
        return;
    }

    if (replace) {
        element.innerHTML = html;
    } else {
        element.innerHTML += html;
    }
}

const renderHint = (value = '') => {
    const action = getAction(value);
    const config = ACTION_CONFIG[action] || DEFAULT_CONFIG;

    renderHtml(config.hint, 'js-hint', true)
}

const renderSuggestions = (value = '') => {
    const action = getAction(value);

    renderHtml('', 'js-suggestions', true)

    // the action is already typed
    if (SUPPORTED_ACTIONS.includes(action)) {
        return;
    }

    const suggestions = SUPPORTED_ACTIONS.filter((supportedAction) => supportedAction.includes(action));
    suggestions.forEach((suggestion) => {
        renderHtml(`
            <li class="suggestion">
                <button class="button suggestion-button" data-action=${suggestion} type="button">
                    <span class="suggestion-title" data-action=${suggestion}>${ACTION_CONFIG[suggestion].label}</span>
                </button>
            </li>`, 'js-suggestions')
    })

    if (!value) {
        renderHtml('<li class="suggestion suggestion-hint"><span class="spotlight-hint">Or just start typing</span></li>', 'js-suggestions')
    }
}

const handleSearch = (event) => {
    const { target: { value = '' } } = event;
    const action = getAction(value);
    const config = ACTION_CONFIG[action] || DEFAULT_CONFIG;

    renderHint(value)
    renderSuggestions(value)

    if (event.key !== 'Enter') {
        return false;
    }

    const result = runMiroCommand(value);

    if (result === true && config.shouldCloseTerminal) {
        handleClose();
    }
}

const handleClose = () => {
    miro.broadcastData(unmountSpotlight());
}

const handleSuggestionClick = (event) => {
    const { target } = event;

    if (!target || !target.dataset) {
        return;
    }

    target.blur();
    const { action } = target.dataset;

    if (action) {
        const $search = document.getElementsByTagName('input').item(0);
        $search.value = `${action.toLowerCase()} `;
        renderHint(action);
        renderSuggestions(action);
        $search.focus();
    }
}

function initSpothlight() {
    miro.broadcastData(spotlightMounted());

    const $container = document.getElementById('js-spotlight');
    const $close = $container.getElementsByClassName('close').item(0);
    const $search = $container.getElementsByTagName('input').item(0);
    const $suggestions = $container.getElementsByClassName('spotlight-suggestions').item(0);

    $close.addEventListener('click', handleClose);
    $search.addEventListener('keyup', handleSearch);
    $suggestions.addEventListener('click', handleSuggestionClick);

    $container.classList.add('spotlight--on')

    renderSuggestions();

    setTimeout(() => {
        $search.focus();
    }, 0)
}

document.addEventListener('DOMContentLoaded', () => {
    miro.onReady(() => {
        setTimeout(initSpothlight, 500)
    })
})
