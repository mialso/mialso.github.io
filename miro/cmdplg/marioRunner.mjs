export const openMario = async () => {
    try {
        const url = 'https://t-plugin.herokuapp.com/miro/cmdplg/mario.html';
        miro.board.ui.openModal(url, { width: 800, height: 800 });
    } catch (error) {
        // nothing for now
    }
}
