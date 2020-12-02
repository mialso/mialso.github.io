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
