export const GIPHY_ADD = 'GIPHY_ADD'

export const giphyAdd = (phrase) => ({
    type: GIPHY_ADD,
    meta: phrase,
});
