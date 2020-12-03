import { startTimer, stopTimer } from './timerAction.mjs'

export const evalTimerCmd = (options) => {
    const [timerAct, seconds] = options
    switch (timerAct) {
    case 'start': {
        if (!seconds) {
            return 'please specify time in seconds'
        }
        miro.broadcastData(startTimer(seconds))
        return true
    }
    case 'stop': {
        miro.broadcastData(stopTimer())
        return true
    }
    default: {
        return 'unknown timer command, use "start [seconds] || "stop"'
    }
    }
}
