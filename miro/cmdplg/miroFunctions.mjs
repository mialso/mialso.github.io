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

                    const scaleWidth = widget.bounds.width / vp.width
                    console.log("scaleWidth", scaleWidth)
                    const scaleHeight = widget.bounds.height / vp.height
                    console.log("scaleHeight", scaleHeight)
                    var scale = scaleWidth > scaleHeight ? scaleWidth : scaleHeight
                    scale = 1 / scale / 3 // 3 times smaller then the viewport

                    const updateWidget = {
                        id: widget.id,
                        x: vp.x + (vp.width / 2),
                        y: vp.y + (vp.height / 2),
                        scale: scale
                    }
                    console.log('update', updateWidget)
                    miro.board.widgets.update(updateWidget)

                    miro.board.selection.selectWidgets(widget.id);
                })
        })
}