export const TERMINAL_META = 'TERMINAL_META'
export const TERMINAL_MOUNTED = 'TERMINAL_MOUNTED'

export const terminalMounted = () => ({
    type: TERMINAL_MOUNTED,
    meta: TERMINAL_META,
})
