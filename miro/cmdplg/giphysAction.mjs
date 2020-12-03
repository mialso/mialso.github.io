import { TERMINAL_META } from './action.mjs';

export const GIPHYS_SEARCH = 'GIPHYS_SEARCH'
export const GIPHYS_RESULTS = 'GIPHYS_RESULTS'

export const giphysSearch = (phrase) => ({
    type: GIPHYS_SEARCH,
    meta: TERMINAL_META,
    payload: phrase,
});

export const giphysResults = (results) => ({
    type: GIPHYS_RESULTS,
    meta: TERMINAL_META,
    payload: results,
});
