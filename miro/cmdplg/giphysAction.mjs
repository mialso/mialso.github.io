import { TERMINAL_META } from './action.mjs';

export const GIPHYS_SEARCH = 'GIPHYS_SEARCH'
export const GIPHYS_RESULTS = 'GIPHYS_RESULTS'
export const GIPHYS_CREATE = 'GIPHYS_CREATE'

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

export const giphysCreate = (payload) => ({
    type: GIPHYS_CREATE,
    meta: TERMINAL_META,
    payload,
});
