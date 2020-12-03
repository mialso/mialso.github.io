export const runGiphy = (action) => {
    if (!action.payload) {
        return 'unknown tag, usage: "$> giphy [tag]"'
    }
    console.log('START ACTION!')

    try {
        fetch(`/gif?tag=${action.payload}`)
            .then((response) => response.text())
            .then((result) => {
                console.log('RESULTS', result);

                const url = decodeURIComponent(result)
                miro.board.widgets.images.createByURL(url);
            })
    } catch (error) {
        // nothing for now
    }
    return true
}
