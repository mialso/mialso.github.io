const handleClose = () => {
    miro.board.ui.closeModal()
}

function initSpothlight() {
    const $container = document.getElementById('js-mario');
    const $close = $container.getElementsByClassName('close').item(0);
    $close.addEventListener('click', handleClose);
}

document.addEventListener('DOMContentLoaded', () => {
    miro.onReady(() => {
        setTimeout(initSpothlight, 500)
    })
})
