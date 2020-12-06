import {
    TERMINAL_META,
    spotlightMounted, unmountSpotlight, evalCmd,
} from './action.mjs'
import { GIPHYS_RESULTS, giphysCreate } from './giphysAction.mjs';
import { runMiroCommand } from './miroCommand.mjs'
import { createSpotlightStore } from './spotlight/store.mjs'
import { renderInput } from './spotlight/Input.mjs'
import { setInputValue } from './spotlight/inputAction.mjs'
import { renderHistory } from './history/History.mjs'
import { toggleHistory } from './history/historyAction.mjs'

const ACTION_CONFIG = {
    CONFETTI: {
        label: 'Confetti',
        hint: 'confetti <span>duration in seconds</span>',
        shouldCloseTerminal: true,
    },
    GIF: {
        label: 'Gif',
        hint: 'gif <span>keyword</span>',
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
        suggestions: [
            {
                label: '2',
                hint: 'Board review',
            },
            {
                label: '3',
                hint: 'Quick voting',
            },
            {
                label: '5',
                hint: 'Quick retro',
            },
            {
                label: '8',
                hint: 'Crazy 8',
            },
            {
                label: '15',
                hint: 'Ideation',
            },
        ],
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
        renderActionSuggestions(action, value);
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

const renderActionSuggestions = (actionItem, value = '') => {

    const action = ACTION_CONFIG[actionItem]

    if (!action) {
        return;
    }

    const supportedSuggestions = action.suggestions ? action.suggestions : [];

    if (!supportedSuggestions.length) {
        return;
    }

    const args = value.split(' ').slice(1).filter(item => item.length);

    const suggestions = args.length ? supportedSuggestions.filter((suggestion) => args.filter(arg => suggestion.label.includes(arg)).length) : supportedSuggestions;
    suggestions.forEach((suggestion) => {
        renderHtml(`
            <li class="suggestion">
                <button class="button suggestion-button" data-action='${actionItem} ${suggestion.label}' type="button">
                    <span class="suggestion-title" data-action='${actionItem} ${suggestion.label}'>${suggestion.label}</span>
                    <span class="suggestion-action-hint" data-action='${actionItem} ${suggestion.label}'>${suggestion.hint}</span>
                </button>
            </li>`, 'js-suggestions')
    })

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

const selectRandomResult = () => {
    const $results = document.getElementsByClassName('result-button').item(0);

    if ($results) {
        $results.click();
    }
}

let lastCommand = '';
const handleInput = ({ dispatch }) => (event) => {
    if (!event) {
        return
    }
    const { target: { value = '' } } = event;

    if (event.key === 'ArrowUp') {
        dispatch(toggleHistory())
        return false;
    }
    const action = getAction(value);
    const config = ACTION_CONFIG[action] || DEFAULT_CONFIG;

    // it should rather use state for it
    if (lastCommand === value) {
        selectRandomResult(config);
        return false;
    }

    cleanResults();
    renderHint(value);
    renderSuggestions(value);

    if (event.key !== 'Enter') {
        dispatch(setInputValue(value))
        return false;
    }

    dispatch(evalCmd(value))
    const result = runMiroCommand(value);

    if (result === true && config.shouldCloseTerminal) {
        handleClose();
    }

    lastCommand = value;
}

const handleClose = () => {
    miro.broadcastData(unmountSpotlight());
}

const handleSuggestionClick = ({ dispatch }) => (event) => {
    const { target } = event;

    if (!target || !target.dataset) {
        return;
    }

    target.blur();
    const { action } = target.dataset;

    if (action) {
        dispatch(setInputValue(`${action.toLowerCase()} `, { hasFocus: true }))
        renderHint(action);
        renderSuggestions(action);
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
        miro.broadcastData(giphysCreate({
            url,
            keyword,
        }));
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
    const store = createSpotlightStore()
    miro.broadcastData(spotlightMounted());

    const $container = document.getElementById('js-spotlight');
    const $close = $container.getElementsByClassName('close').item(0);
    const $input = $container.getElementsByTagName('input').item(0);
    const $suggestions = $container.getElementsByClassName('spotlight-suggestions').item(0);
    const $results = $container.getElementsByClassName('spotlight-results').item(0);
    const $history = document.querySelector('.cmd-history')

    store.subscribe(renderInput(store, $input))
    $input.addEventListener('keyup', handleInput(store));

    store.subscribe(renderHistory(store, $history))

    $close.addEventListener('click', handleClose);
    $suggestions.addEventListener('click', handleSuggestionClick(store));
    $results.addEventListener('click', handleResultClick);

    $container.classList.add('spotlight--on')

    renderSuggestions();

    miro.addListener('DATA_BROADCASTED', dataMessageHandler)
}

document.addEventListener('DOMContentLoaded', () => {
    miro.onReady(() => {
        setTimeout(initSpothlight, 500)
    })
})
