import { spotlightMounted, unmountSpotlight, TERMINAL_META } from './action.mjs'
import { GIPHYS_RESULTS } from './giphysAction.mjs';
import { runMiroCommand } from './miroCommand.mjs'
import { createImageByUrl } from './miroFunctions.mjs'

const ACTION_CONFIG = {
    CONFETTI: {
        label: 'Confetti',
        hint: 'confetti <span>duration in seconds</span>',
        shouldCloseTerminal: true,
    },
    GIF: {
        label: 'Gif',
        hint: 'gif <span>keyword</span>',
        shouldCloseTerminal: true,
    },
    GIFS: {
        label: 'Gifs',
        hint: 'gifs <span>keyword</span>',
        shouldCloseTerminal: false,
    },
    IMAGE: {
        label: 'Image',
        hint: 'image <span>keyword</span>',
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

const renderResults = (results) => {
    renderHtml('', 'js-results', true);
    results.forEach((result) => {
        renderHtml(`
            <li class="result">
                <button class="button result-button" data-url=${result.original} data-keyword="gif" type="button">
                   <img class="result-preview" src="${result.preview}" alt="gif" data-url=${result.original} data-keyword="gif" />
                </button>
            </li>`, 'js-results')
    });
}

const cleanResults = () => {
    renderHtml('', 'js-results', true);
}

const handleSearch = (event) => {
    const { target: { value = '' } } = event;
    const action = getAction(value);
    const config = ACTION_CONFIG[action] || DEFAULT_CONFIG;

    cleanResults();
    renderHint(value);
    renderSuggestions(value);

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

const handleResultClick = (event) => {
    const { target } = event;

    if (!target || !target.dataset) {
        return;
    }

    target.blur();
    const { url, keyword = '' } = target.dataset;

    if (url) {
        createImageByUrl(url, keyword)
        handleClose();
    }
}

const dataMessageHandler = (message) => {
    if (!message.data) {
        return
    }
    const action = message.data
    if (!(action.type && action.meta && action.meta === TERMINAL_META)) {
        return
    }
    const event = message.data
    switch (event.type) {
    case GIPHYS_RESULTS: {
        renderResults(action.payload)
        break
    }
    default: break
    }
}

function initSpothlight() {
    miro.broadcastData(spotlightMounted());

    const $container = document.getElementById('js-spotlight');
    const $close = $container.getElementsByClassName('close').item(0);
    const $search = $container.getElementsByTagName('input').item(0);
    const $suggestions = $container.getElementsByClassName('spotlight-suggestions').item(0);
    const $results = $container.getElementsByClassName('spotlight-results').item(0);

    $close.addEventListener('click', handleClose);
    $search.addEventListener('keyup', handleSearch);
    $suggestions.addEventListener('click', handleSuggestionClick);
    $results.addEventListener('click', handleResultClick);

    $container.classList.add('spotlight--on')

    renderSuggestions();

    setTimeout(() => {
        $search.focus();
    }, 0)

    miro.addListener('DATA_BROADCASTED', dataMessageHandler)
}

document.addEventListener('DOMContentLoaded', () => {
    miro.onReady(() => {
        setTimeout(initSpothlight, 500)
    })
})
