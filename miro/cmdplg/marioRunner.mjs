export const openMario = async (action) => {
    console.log('run mario')

    try {
        const url = "https://t-plugin.herokuapp.com/miro/cmdplg/mario.html";
        miro.board.ui.openModal(url, { width: 660, height: 500 })
            .then(() => { miro.showNotification("Mario closed"); });
    } catch (error) {
        // nothing for now
    }
}
