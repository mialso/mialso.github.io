export const spotlightLogger = () => (next) => (action) => {
    console.info(`[SP_LOG]: ${action.type}`)
    next(action)
}
