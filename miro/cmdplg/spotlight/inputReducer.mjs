import { SET_INPUT_VALUE } from './inputAction.mjs'

export const initialState = {
    value: '',
    hasFocus: true,
}

export function inputReducer(state = initialState, action) {
    switch (action.type) {
    case SET_INPUT_VALUE: {
        const { value, hasFocus } = action.payload
        if (state.value === value && state.hasFocus === hasFocus) {
            return state
        }
        return { value, hasFocus }
    }
    default: return state
    }
}
