import { spotlightMounted, unmountSpotlight } from './action.mjs'
import { runMiroCommand } from './miroCommand.mjs'

const SUPPORTED_ACTIONS = ['CONFETTI', 'GIPHY', 'IMAGE', 'PLAY', 'TIMER'];

const LABELS = {
    CONFETTI: 'Confetti',
    GIPHY: 'Giphy',
    IMAGE: 'Image',
    PLAY: 'Play',
    TIMER: 'Timer',
}

const HINTS = {
    CONFETTI: 'confetti <span>duration in seconds</span>',
    GIPHY: 'giphy <span>phrase</span>',
    IMAGE: 'image <span>phrase</span>',
    PLAY: 'play <span>game - only mario for now</span>',
    TIMER: 'timer <span>duration</span> <span>action (optional)</span>',
    '@OTHER': 'What do you want to do?',
}

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

    renderHtml(HINTS[action] || HINTS['@OTHER'], 'js-hint', true)
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
                    <span class="suggestion-title" data-action=${suggestion}>${LABELS[suggestion]}</span>
                </button>
            </li>`, 'js-suggestions')
    })

    if (!value) {
        renderHtml('<li class="suggestion suggestion-hint"><span class="spotlight-hint">Or just start typing</span></li>', 'js-suggestions')
    }
}

const handleSearch = (event) => {
    const { target: { value } } = event;

    renderHint(value)
    renderSuggestions(value)

    if (event.key !== 'Enter') {
        return false;
    }

    const result = runMiroCommand(value);

    if (result === true) {
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
