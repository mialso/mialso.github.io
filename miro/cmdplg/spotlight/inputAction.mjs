export const SET_INPUT_VALUE = 'SET_INPUT_VALUE'

export const setInputValue = (value, { hasFocus } = { hasFocus: true }) => ({
    type: SET_INPUT_VALUE,
    payload: { value, hasFocus },
})
