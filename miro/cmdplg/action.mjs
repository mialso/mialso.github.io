export const EVAL_CMD_SUCCESS = 'EVAL_CMD_SUCCESS'
export const EVAL_CMD_ERROR = 'EVAL_CMD_ERROR'
export const TERMINAL_META = 'TERMINAL_META'
export const TERMINAL_MOUNTED = 'TERMINAL_MOUNTED'
export const SPOTLIGHT_MOUNTED = 'SPOTLIGHT_MOUNTED'
export const UNMOUNT_SPOTLIGHT = 'UNMOUNT_SPOTLIGHT'
export const SET_UI_TYPE = 'SET_UI_TYPE'
export const SEND_NOTIFICATION = 'SEND_NOTIFICATION'

export const terminalMounted = () => ({
    type: TERMINAL_MOUNTED,
    meta: TERMINAL_META,
})

export const evalCmdSuccess = () => ({
    type: EVAL_CMD_SUCCESS,
    meta: TERMINAL_META,
})

export const evalCmdError = (errorString) => ({
    type: EVAL_CMD_ERROR,
    payload: errorString,
    meta: TERMINAL_META,
})

export const spotlightMounted = () => ({
    type: SPOTLIGHT_MOUNTED,
    meta: TERMINAL_META,
})

export const unmountSpotlight = () => ({
    type: UNMOUNT_SPOTLIGHT,
    meta: TERMINAL_META,
})

export const setUiType = (uiType) => ({
    type: SET_UI_TYPE,
    payload: uiType,
    meta: TERMINAL_META,
})

export const sendNotification = (message) => ({
    type: SEND_NOTIFICATION,
    payload: message,
    meta: TERMINAL_META,
})
