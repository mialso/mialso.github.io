import { TERMINAL_META } from './action.mjs';

export const GIPHY_ADD = 'GIPHY_ADD'

export const giphyAdd = (phrase) => ({
    type: GIPHY_ADD,
    meta: TERMINAL_META,
    payload: phrase,
});
