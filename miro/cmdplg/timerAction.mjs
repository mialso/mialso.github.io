import { TERMINAL_META } from './action.mjs'
// this is a very secret constant to emit message for any plugin
const PLUGIN_SCOPE = 'PLUGIN_SCOPE'
export const EVAL_TIMER = 'EVAL_TIMER'
export const START_TIMER = '[PLUGIN] START_TIMER_CMD'
export const STOP_TIMER = '[PLUGIN] STOP_TIMER_CMD'

export const startTimer = (seconds) => ({
    type: START_TIMER,
    payload: { seconds },
    meta: PLUGIN_SCOPE,
})

export const stopTimer = () => ({
    type: STOP_TIMER,
    meta: PLUGIN_SCOPE,
})

export const evalTimer = (options) => ({
    type: EVAL_TIMER,
    payload: options,
    meta: TERMINAL_META,
})
