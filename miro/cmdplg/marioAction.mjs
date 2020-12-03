import {TERMINAL_META} from './action.mjs';

export const RUN_MARIO = 'RUN_MARIO'

export const runMario = () => ({
    type: RUN_MARIO,
    mea: TERMINAL_META,
    payload: "",
});
