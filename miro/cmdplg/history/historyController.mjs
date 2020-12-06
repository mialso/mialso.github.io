import {
    TOGGLE_HISTORY,
    setHistoryView, clearHistoryView, setHistoryItem,
} from './historyAction.mjs'
import { EVAL_CMD } from '../action.mjs'

export const historyController = ({ getState, dispatch }) => (next) => (action) => {
    next(action)
    switch (action.type) {
    case TOGGLE_HISTORY: {
        const { input, history } = getState()
        if (history.viewItems.length > 0) {
            dispatch(clearHistoryView())
        } else {
            dispatch(setHistoryView(input.value))
        }
        break
    }
    case EVAL_CMD: {
        dispatch(setHistoryItem({ inputCmd: action.payload }))
        break
    }
    default: break
    }
}
