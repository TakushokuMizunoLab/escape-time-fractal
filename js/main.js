const {getel, on} = DOMUtl();

//ページ読み込み時に発火するコールバック
on(window, "load", _ => {

    console.log("page loaded!");

    const canvas = getel("#canvas"),
          ctx = canvas.getContext("2d");

    let canvasSize = 400;
    let iterator = 3000;

    canvas.width = canvas.height = canvasSize;

    on(canvas, "mousedown", e => {

    });

    on(canvas, "mousemove", e => {

    });

    on(canvas, "mouseup", e => {

    });

    function calcMandelbrot (sx, sy, w) {

        let res_map = new Array(canvasSize)
                          .fill(0)
                          .map(_ => new Array(canvasSize).fill(0));
        for (let y = 0; y < canvasSize; y++) {
            for (let x = 0; x < canvasSize; x++) {
                let xx = sx - w / 2 + x / canvasSize * w,
                    yy = sy - w / 2 + y / canvasSize  * w;
                let zx = 0, zy = 0;
                let cx = xx, cy = yy;
                let tx = 0, ty = 0, i = 0;
                for (i = 0; i < iterator; i++) {
                    tx = zx * zx - zy * zy;
                    ty = 2 * zx * zy;
                    zx = tx + cx, zy = ty + cy;
                    if (Math.sqrt(zx * zx + zy * zy) > 2) {
                        res_map[y][x] = i;
                        break;
                    }
                }
            }
        }
        draw(res_map);

    }

    function draw (src_map) {

        let imgData = ctx.getImageData(0, 0, canvasSize, canvasSize);
        let data = imgData.data;
        let dataPtr = 0;
        src_map.forEach(arr => 
            arr.forEach(val => {
                if (val === 0) {
                    data[dataPtr] = data[dataPtr + 1] = data[dataPtr + 2] = 0;
                    data[dataPtr + 3] = 255;
                } else {
                    data[dataPtr] = data[dataPtr + 1] = data[dataPtr + 2] = 255;
                    data[dataPtr + 3] = 255;
                }
                dataPtr += 4;
            })
        );
        ctx.putImageData(imgData, 0, 0);

    }

    calcMandelbrot(.25, 0, .1);

});