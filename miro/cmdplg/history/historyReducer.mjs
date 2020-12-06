import { SET_HISTORY_ITEM, SET_HISTORY_VIEW } from './historyAction.mjs'

export const initialState = {
    historyItems: [],
    viewItems: [],
    activeItemIndex: 0,
}

export function addHistoryItem(prevItems, newItem) {
    return prevItems.filter((item) => item !== newItem).concat(newItem)
}

export function historyReducer(state = initialState, action) {
    switch (action.type) {
    case SET_HISTORY_ITEM: {
        const inputCmd = action.payload.inputCmd.trim()
        return {
            ...state,
            historyItems: addHistoryItem(state.historyItems, inputCmd),
        }
    }
    case SET_HISTORY_VIEW: {
        const currentCmd = action.payload.currentInput.trim()
        const viewItems = state.historyItems.filter((item) => item.startsWith(currentCmd))
        return {
            ...state,
            viewItems,
            activeItemIndex: viewItems.length - 1,
        }
    }
    default: return state
    }
}
