export const API_DEFAULTS = {
    // temporarly it will be the fastest to keep it here, it's a test one
    KEY: 'YpcX8XXldDLZQeuNC7ewnZNj7vmETjFR',
    RATING: 'pg',
}

export const runGiphy = async (action) => {
    console.log('START ACTION!')

    try {
        const result = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=${API_DEFAULTS.KEY}&rating=${API_DEFAULTS.RATING}&tag=${action.payload}`)
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
