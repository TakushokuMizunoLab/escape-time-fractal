const {getel, on} = DOMUtl();

//ページ読み込み時に発火するコールバック
on(window, "load", _ => {

    console.log("page loaded!");

    const canvas = getel("#canvas"),
          ctx = canvas.getContext("2d");

    let canvasSize = 400;
    let iterator = 3000;
    let isMouseDown = false;
    let calcOpt = {
        sx: 0,
        sy: 0,
        w: 2
    },
    clickPos = {
        x: 0,
        y: 0
    },
    param = {
        n: .7885 * Math.cos(0),
        i: .7885 * Math.sin(0)
    };
    let calcOptHistory = [];
    let mandelbrotImageData;

    canvas.width = canvas.height = canvasSize;

    on(canvas, "mousedown", e => {

        if (!isMouseDown) {
            isMouseDown = true;
            clickPos = getPos(e);
        }

    });

    on(canvas, "mousemove", e => {

        if (isMouseDown) {
            drawResizeControl(clickPos, getPos(e));
        }

    });

    on(canvas, "mouseup", e => {

        if (isMouseDown) {
            isMouseDown = false;
            let nowPos = getPos(e);
            let nsx = calcOpt.sx - calcOpt.w + clickPos.x / canvasSize * calcOpt.w * 2,
                nsy = calcOpt.sy - calcOpt.w + clickPos.y / canvasSize * calcOpt.w * 2,
                nw = Math.abs(calcOpt.w * ((clickPos.x - Math.max(nowPos.x, nowPos.y)) / canvasSize * 2));
            updateCalcOptHistory(calcOpt);
            calcOpt.sx = nsx;
            calcOpt.sy = nsy;
            calcOpt.w = nw;
            calcMandelbrot(calcOpt);
        }

    });

    //キャンバスのクリックイベントから座標値を算出する
    function getPos (e) {

        let rect = e.target.getBoundingClientRect();
        let res_obj = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        //console.log(res_obj);
        return res_obj;

    }

    //描画領域を変更する際のコントロールを描画する
    function drawResizeControl (fromPos, toPos) {

        let dx = Math.abs(toPos.x - fromPos.x),
            dy = Math.abs(toPos.y - fromPos.y);
        let dis = Math.max(dx, dy);
        ctx.clearRect(0, 0, canvasSize, canvasSize);
        ctx.putImageData(mandelbrotImageData, 0, 0);
        ctx.save();
        ctx.globalAlpha = .5;
        ctx.fillStyle = "red";
        ctx.fillRect(fromPos.x - dis, fromPos.y - dis, dis * 2, dis * 2);
        ctx.restore();

    }

    //履歴のハッシュを更新する
    //追加、リドゥはここで受け持つ
    function updateCalcOptHistory (arg = false) {

        if (arg) {
            calcOptHistory.push({...arg});
        }
        if (calcOptHistory.length > 0) {
            getel("#redo").removeAttribute("disabled");
        } else {
            getel("#redo").setAttribute("disabled", true);
        }

    }

    //マンデルブロ集合を計算する
    function calcMandelbrot (arg) {

        let {sx, sy, w} = arg;
        let coe = +getel("#coe-num").value,
            dec = +getel("#dec-num").value;
        param.n = coe * Math.cos(dec);
        param.i = coe * Math.sin(dec);
        let res_map = new Array(canvasSize)
                          .fill(0)
                          .map(_ => new Array(canvasSize).fill(-1));
        let xx, yy, zx, zy, cx, cy, tx, ty;
        for (let y = 0; y < canvasSize; y++) {
            for (let x = 0; x < canvasSize; x++) {
                xx = sx - w + x / canvasSize * w * 2;
                yy = sy - w + y / canvasSize * w * 2;
                zx = xx, zy = yy;
                cx = param.n, cy = param.i;
                tx = ty = i = 0;
                for (i = 0; i < iterator; i++) {
                    tx = zx * zx - zy * zy;
                    ty = 2 * zx * zy;
                    zx = tx + cx, zy = ty + cy;
                    if ((zx * zx + zy * zy) > 4) {
                        res_map[y][x] = i;
                        break;
                    }
                }
            }
        }
        drawSet(res_map);

    }

    //マンデルブロ集合を描画する
    function drawSet (src_map) {

        ctx.clearRect(0, 0, canvasSize, canvasSize);
        let imgData = ctx.getImageData(0, 0, canvasSize, canvasSize);
        let data = imgData.data;
        let dataPtr = 0;
        src_map.forEach(arr => 
            arr.forEach(val => {
                if (val === -1) {
                    data[dataPtr] = data[dataPtr + 1] = data[dataPtr + 2] = 0;
                    data[dataPtr + 3] = 255;
                } else {
                    data[dataPtr] = val % 3 == 0 ? 255 : 0;
                    data[dataPtr + 1] = val % 3 == 1 ? 255 : 0;
                    data[dataPtr + 2] = val % 3 == 2 ? 255 : 0;
                    data[dataPtr + 3] = 255;
                }
                dataPtr += 4;
            })
        );
        ctx.putImageData(imgData, 0, 0);
        mandelbrotImageData = imgData;

    }

    //redoボタンのコールバック
    //パラメータをひとつ前の状態に戻した上で再描画
    on(getel("#redo"), "click", e => {

        calcOpt = calcOptHistory.pop();
        updateCalcOptHistory();
        calcMandelbrot(calcOpt);

    });

    //再描画ボタンのコールバック
    //パラメータの変更などに際して手動で再描画を行う
    on(getel("#repaint"), "click", e => {

        calcOpt = {
            sx: 0,
            sy: 0,
            w: 2
        };
        calcMandelbrot(calcOpt);

    });

    calcMandelbrot(calcOpt);

});