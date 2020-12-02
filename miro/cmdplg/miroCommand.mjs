
import { giphyAdd } from './giphyAction.mjs'
import { imageAdd } from './imageMeAction.mjs'

// this is very secret constant to emit message for any plugin
export const PLUGIN_SCOPE = 'PLUGIN_SCOPE'
export const MIRO_COMMAND = 'MIRO_COMMAND'
export const SELECT_WIDGETS = 'SELECT_WIDGETS'
export const RUN_TIMER = 'RUN_TIMER'
export const START_TIMER = '[PLUGIN] START_TIMER_CMD'

export const selectWidgets = () => ({
    type: SELECT_WIDGETS,
    meta: MIRO_COMMAND,
})

export const startTimer = (seconds) => ({
    type: START_TIMER,
    payload: { seconds },
    meta: PLUGIN_SCOPE,
})

export const runMiroCommand = (cmdStr) => {
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
