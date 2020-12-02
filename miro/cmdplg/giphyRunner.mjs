export const runGiphy = async (action) => {
    console.log('START ACTION!')

    try {
        const result = await fetch(`/gif?tag=${action.payload}`)
            .then((response) => response.json());

        console.log('RESULTS', result);

        if (!result.data || !result.data.url) {
            return;
        }

        const url = decodeURIComponent(result.data.image_original_url)
        miro.board.widgets.images.createByURL(url);
    } catch (error) {
        // nothing for now
    }
}
