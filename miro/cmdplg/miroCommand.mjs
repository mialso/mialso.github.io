import { giphyAdd } from './giphyAction.mjs'
import { imageAdd } from './imageMeAction.mjs'
import { runMario } from './marioAction.mjs'
import { evalTimer } from './timerAction.mjs'

export const MIRO_COMMAND = 'MIRO_COMMAND'
export const SELECT_WIDGETS = 'SELECT_WIDGETS'

export const selectWidgets = () => ({
    type: SELECT_WIDGETS,
    meta: MIRO_COMMAND,
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
    case 'mario': {
        miro.broadcastData(runMario());
        return true
    }
    case 'timer': {
        miro.broadcastData(evalTimer(words.slice(1)))
        return true
    }
    default: {
        return false
    }
    }
}
