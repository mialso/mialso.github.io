export const createImageByUrl = (url, tag) => {
    miro.board.viewport.get()
        .then(vp => {
            console.log('viewport', vp)
            const targetX = (vp.x + vp.width) / 2;
            const targetY = (vp.y + vp.height) / 2;
            const image = {
                type: "image",
                url: decodeURIComponent(url),
                x: targetX,
                y: targetY,
                title: tag
            }

            miro.board.widgets.create(image)
                .then(widgets => {
                    const widget = widgets[0]
                    console.log('widget', widget)
                    miro.board.selection.selectWidgets(widget.id);
                    const viewport = {
                        x: widget.x - 100,
                        y: widget.y - 100,
                        width: widget.bounds.width + 200,
                        height: widget.bounds.height + 200
                    }
                    miro.board.viewport.set(viewport, { animationTimeInMS: 300 });
                })
        })
}