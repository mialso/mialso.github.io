import {TERMINAL_META} from './action.mjs';

export const IMAGE_ADD = 'IMAGE_ADD'

export const imageAdd = (url) => ({
    type: IMAGE_ADD,
    meta: TERMINAL_META,
    payload: url,
});
