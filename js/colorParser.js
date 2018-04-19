rgbToHsv = function(rgb) {
    let r = rgb.r;
    let g = rgb.g;
    let b = rgb.b;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h;
    if (r == g && g == b) h = 0;
    else if (max == r) {
        h = 60 * ((g - b) / (max - min));
    } else if (max == g) {
        h = 60 * ((b - r) / (max - min)) + 120;
    } else {
        h = 60 * ((r - g) / (max - min)) + 240;
    }
    if (h < 0) h += 360;
    return {
        h: h / 360 * 255,
        s: (max - min) / max * 255,
        v: max
    }
  };
hsvToRgb = function(hsv){
    let h = hsv.h / 255 * 360;
    let s = hsv.s;
    let v = hsv.v;
    let max = v;
    let min = max - ((s / 255) * max);
    let r, g, b;
    if (h <= 60) {
        r = max;
        g = (h / 60) * (max - min) + min;
        b = min;
    } else if(h <= 120) {
        r = ((120 - h) / 60) * (max - min) + min;
        g = max;
        b = min;
    } else if (h <= 180) {
        r = min;
        g = max;
        b = ((h - 120) / 60) * (max - min) + min;
    } else if (h <= 240) {
        r = min;
        g = ((240 - h) / 60) * (max - min) + min;
        b = max;
    } else if (h <= 300) {
        r = ((h - 240) / 60) * (max - min) + min;
        g = min;
        b = max;
    } else {
        r = max;
        g = min;
        b = ((360 - h) / 60) * (max - min) + min;
    }
    return { r, g, b };
  };