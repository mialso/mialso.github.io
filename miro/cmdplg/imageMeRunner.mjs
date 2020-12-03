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

                if (!result) {
                    return;
                }

                const url = decodeURIComponent(result)

                createImageByUrl(url, action.payload)
            })
    } catch (error) {
        // nothing for now
    }
    return true
}
