import { startTimer, stopTimer, adjustTimer } from './timerAction.mjs'

const START = 'start'
const STOP = 'stop'
const ADD = 'add'

const MINUTE = 'min'
const HOUR = 'hour'
const SECOND = 'sec'

export const isTimeAction = (action) => {
    return action === MINUTE || action === HOUR || action === SECOND
}
export const getTimeMultiple = (timeAction) => {
    switch (timeAction) {
    case MINUTE: return 60
    case HOUR: return 3600
    default: return 1
    }
}

export const verTwoParser = (options) => {
    const [duration, actOne, actTwo] = options
    const timeDuration = Number.parseFloat(duration)
    if (Number.isNaN(timeDuration) || typeof timeDuration !== 'number') {
        return options
    }
    if (timeDuration === 0) {
        return [STOP]
    }
    if (isTimeAction(actOne) && actTwo === 'string') {
        const resultDuration = timeDuration * getTimeMultiple(actOne)
        return [actTwo || START, resultDuration]
    }
    return [actOne || START, timeDuration * 60]
}

export const evalTimerCmd = (dispatch) => (options) => {
    const [timerAct, seconds] = verTwoParser(options)
    switch (timerAct) {
    case START: {
        if (!seconds) {
            return 'please specify time in seconds'
        }
        dispatch(startTimer(seconds))
        return true
    }
    case STOP: {
        dispatch(stopTimer())
        return true
    }
    case ADD: {
        if (!seconds) {
            return 'please specify time in seconds'
        }
        dispatch(adjustTimer(seconds))
        return true
    }
    default: {
        return 'unknown timer command, use "start || "stop" || "add"'
    }
    }
}
