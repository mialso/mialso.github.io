import { createImageByUrl } from './miroFunctions.mjs'

export const runImageMe = (action) => {
    if (!action.payload) {
        return 'unknown tag, usage: "$> image [tag]"'
    }
    console.log('run Image Me')

    try {
        fetch(`/image?tag=${action.payload}`)
            .then((response) => response.text())
            .then((result) => {
                console.log('RESULTS', result);

                createImageByUrl(result, action.payload)
            })
    } catch (error) {
        // nothing for now
    }
    return true
}
