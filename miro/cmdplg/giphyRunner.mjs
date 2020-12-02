export const runGiphy = async (action) => {
    console.log('START ACTION!')

    try {
        const result = await fetch(`/gif?tag=${action.payload}`)
            .then((response) => response);

        console.log('RESULTS', result);

        const url = decodeURIComponent(result)
        miro.board.widgets.images.createByURL(url);
    } catch (error) {
        // nothing for now
    }
}
