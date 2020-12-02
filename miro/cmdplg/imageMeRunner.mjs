export const runImageMe = async (action) => {
    console.log('run Image Me')

    try {
        const result = await fetch(`/image?tag=${action.payload}`)
            .then((response) => response.text());

        console.log('RESULTS', result);

        if (!result) {
            return;
        }

        const url = decodeURIComponent(result)
        miro.board.widgets.images.createByURL(url);
    } catch (error) {
        // nothing for now
    }
}
