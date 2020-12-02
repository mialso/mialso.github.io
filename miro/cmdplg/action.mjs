export const TERMINAL_META = 'TERMINAL_META'
export const TERMINAL_MOUNTED = 'TERMINAL_MOUNTED'
export const SPOTLIGHT_MOUNTED = 'SPOTLIGHT_MOUNTED'

export const terminalMounted = () => ({
    type: TERMINAL_MOUNTED,
    meta: TERMINAL_META,
})

export const spotlightMounted = () => ({
    type: SPOTLIGHT_MOUNTED,
    meta: TERMINAL_META,
})
