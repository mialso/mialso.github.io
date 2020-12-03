export createImageByUrl = (url, tag) => {
    miro.board.viewport.get()
        .then(vp => {
            const targetX = (vp.x + vp.width) / 2;
            const targetY = (vp.y + vp.height) / 2;
            const options = { x: targetX, y: targetY, title: action.payload };
            miro.board.widgets.images.createByURL(url, options)
                .then(widget => miro.board.selection.selectWidgets(widget.id));
        })
}