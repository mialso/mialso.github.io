export const TOGGLE_HISTORY = 'TOGGLE_HISTORY'
export const SET_HISTORY_ITEM = 'SET_HISTORY_ITEM'
export const SET_HISTORY_VIEW = 'SET_HISTORY_VIEW'
export const CLEAR_HISTORY_VIEW = 'CLEAR_HISTORY_VIEW'

export const toggleHistory = () => ({
    type: TOGGLE_HISTORY,
})

export const setHistoryItem = ({ inputCmd }) => ({
    type: SET_HISTORY_ITEM,
    payload: { inputCmd },
})

export const clearHistoryView = () => ({
    type: CLEAR_HISTORY_VIEW,
})

export const setHistoryView = (currentInput) => ({
    type: SET_HISTORY_VIEW,
    payload: { currentInput },
})
