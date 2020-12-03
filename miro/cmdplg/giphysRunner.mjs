import { giphysResults } from './giphysAction.mjs';

export const runGiphys = (action) => {
    console.log('RUN GIPHYS', action)
    if (!action.payload) {
        return 'unknown tag, usage: "$> giphy [tag]"'
    }
    console.log('START ACTION!')

    try {
        fetch(`/gifs?q=${action.payload}`)
            .then((response) => response.json())
            .then((result) => {
                console.log('RESULTS', result);

                miro.broadcastData(giphysResults(result))
                return true
            })
    } catch (error) {
        return 'Could not find gifs related to your query!'
    }
}
