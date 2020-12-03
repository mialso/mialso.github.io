import { startTimer, stopTimer } from './timerAction.mjs'

export const evalTimerCmd = (dispatch) => (options) => {
    const [timerAct, seconds] = options
    switch (timerAct) {
    case 'start': {
        if (!seconds) {
            return 'please specify time in seconds'
        }
        dispatch(startTimer(seconds))
        return true
    }
    case 'stop': {
        dispatch(stopTimer())
        return true
    }
    default: {
        return 'unknown timer command, use "start [seconds] || "stop"'
    }
    }
}
