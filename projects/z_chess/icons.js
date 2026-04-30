let green = [90, 150, 100];
let beige = [150, 125, 120];
let black = [50, 50, 50];
let white = [200, 205, 200];
let color1 = black;
let color2 = white;
function createImage(callback, size=128) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    canvas.style = "border: 1px dashed black; margin: 10px;";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    let data = ctx.createImageData(canvas.width, canvas.height);
    for(let i=0; i<data.data.length; i+=4) {
        let ci = i / 4;
        let x = ci % canvas.width;
        let y = Math.floor(ci / canvas.width);
        let [r, g, b, a] = callback(x, y);
        data.data[i] = r;
        data.data[i+1] = g;
        data.data[i+2] = b;
        data.data[i+3] = a;
    }
    ctx.putImageData(data, 0, 0);
    return canvas;
}
createImage((x, y) => {
    let bx = Math.floor(x / 600 * 8);
    let by = Math.floor(y / 600 * 8);
    let grady = y / 600 * 8 - by;
    let gradx = x / 600 * 8 - bx;
    let disty = grady * 2 - 1;
    let distx = gradx * 2 - 1;
    let bevelr = 0.85;
    let bevelnx = distx < -bevelr ? 1 : 0;
    let bevelpx = distx > bevelr ? 1 : 0;
    let bevelny = disty > bevelr ? 1 : 0;
    let bevelpy = disty < -bevelr ? 1 : 0;
    if(distx > -disty || distx < disty) bevelpy = 0;
    if(distx <= -disty || distx < disty) bevelpx = 0;
    if(distx > -disty || disty < distx) bevelnx = 0;
    if(distx <= -disty || disty < distx) bevelny = 0;
    if((bx + by) % 2 == 0) {
        let r = 180;
        let g = 180;
        let b = 170;
        r -= grady * 60;
        g -= grady * 50;
        b -= grady * 30;
        r += bevelpy * 30;
        g += bevelpy * 30;
        b += bevelpy * 30;
        r += bevelpx * 35;
        g += bevelpx * 35;
        b += bevelpx * 35;
        r += bevelnx * -40;
        g += bevelnx * -40;
        b += bevelnx * -40;
        r += bevelny * -40;
        g += bevelny * -40;
        b += bevelny * -40;
        return [r, g, b, 255];
    } else {
        let r = 120;
        let g = 150;
        let b = 90;
        r -= grady * 60;
        g -= grady * 30;
        b -= grady * 20;
        r += bevelpy * 30;
        g += bevelpy * 30;
        b += bevelpy * 30;
        r += bevelpx * 35;
        g += bevelpx * 35;
        b += bevelpx * 35;
        r += bevelnx * -40;
        g += bevelnx * -40;
        b += bevelnx * -40;
        r += bevelny * -40;
        g += bevelny * -40;
        b += bevelny * -40;
        return [r, g, b, 255];
    }
}, 600);
function rook(x, y, r, g, b) {
    let a = 0;
    if(x>30 && x<=98 && y>100 && y<=110) a = 255;
    if(x>40-(y-90) && x<=88+(y-90) && y>90 && y<=100) {
        if(x>48 && x<=80 && y>94) {
            r += (x - 40) * 1.4 + 20;
            g += (x - 40) * 1.4 + 20;
            b += (x - 40) * 1.4 + 20;
        }
        a = 255;
    }
    if(x>40 && x<=88 && y>45 && y<=90) {
        if(x>48 && x<=80 && y<=86 && y>51) {
            r += (x - 40) * 1.4 + 20;
            g += (x - 40) * 1.4 + 20;
            b += (x - 40) * 1.4 + 20;
        }
        a = 255;
    }
    if(x>33 && x<=95 && y>30 && y<=38) a = 255;
    if(x>33+(y-38) && x<=95-(y-38) && y>38 && y<=45) {
        if(x>48 && x<=80 && y<=43) {
            r += (x - 40) * 1.4 + 20;
            g += (x - 40) * 1.4 + 20;
            b += (x - 40) * 1.4 + 20;
        }
        a = 255;
    }
    if(x>33 && x<=46 && y>20 && y<=30) a = 255;
    if(x>52 && x<=76 && y>20 && y<=30) a = 255;
    if(x>82 && x<=95 && y>20 && y<=30) a = 255;
    if(x + y > 205) a = 0;
    if(-x + y > 76) a = 0;
    if(x + -y > 72) a = 0;
    if(-x + -y > -57) a = 0;
    r -= y * 0.3;
    g -= y * 0.3;
    b -= y * 0.3;
    return [r, g, b, a];
}
createImage((x, y) => {
    return rook(x, y, ...color1);
});
createImage((x, y) => {
    return rook(x, y, ...color2);
});
function rect(x, y, cx, cy, w, h) {
    return Math.abs(x-cx) <= w && Math.abs(y-cy) <= h;
}
function circle(x, y, cx, cy, r) {
    return Math.sqrt((x-cx)**2 + (y-cy)**2) <= r;
}
function bevelTopLeft(x, y, r) {
    return -x + -y > r;
}
function bevelBottomLeft(x, y, r) {
    return -x + y > r;
}
function bevelTopRight(x, y, r) {
    return x + -y > r;
}
function bevelBottomRight(x, y, r) {
    return x + y > r;
}
function pawn(x, y, r, g, b) {
    let a = 0;
    if(rect(x, y, 64, 110-5, 30, 5) && !bevelBottomLeft(x, y, 73) && !bevelBottomRight(x, y, 201)) a = 255;
    if(rect(x, y, 64, 110-15, 30, 5) && !bevelTopLeft(x, y, -134) && !bevelTopRight(x, y, -6)) a = 255;
    if(rect(x, y, 64, 110-18, 22, 5)) a = 255;
    if(rect(x, y, 64, 110-28, 22, 5) && !bevelTopLeft(x, y, -129) && !bevelTopRight(x, y, -1)) a = 255;
    if(rect(x, y, 64, 84, 12, 24)) a = 255;
    if(rect(x, y, 64, 57, 22, 3) && !bevelTopLeft(x, y, -102) && !bevelTopRight(x, y, 26)) a = 255;
    if(rect(x, y, 64, 64, 22, 3) && !bevelBottomLeft(x, y, 23) && !bevelBottomRight(x, y, 151)) a = 255;
    if(circle(x, y, 64, 40, 15)) a = 255;
    let light = false;
    light ||= rect(x, y, 64, 79, 4, 19);
    light ||= circle(x, y, 64, 40, 7);
    light ||= rect(x, y, 64, 96.5, 20, 3.5) && !bevelTopLeft(x, y, -145) && !bevelTopRight(x, y, -17)
    light ||= rect(x, y, 64, 82.5, 10, 3.5) && !bevelTopLeft(x, y, -138) && !bevelTopRight(x, y, -10);
    light ||= rect(x, y, 64, 88.5, 11, 3.5);
    light &&= !rect(x, y, 64, 78, 19, 4);
    light &&= !rect(x, y, 64, 91, 19, 3);
    if(light) {
        r += (x - 40) * 1.4 + 20;
        g += (x - 40) * 1.4 + 20;
        b += (x - 40) * 1.4 + 20;
    }
    return [r, g, b, a];
}
createImage((x, y) => {
    return pawn(x, y, ...color1);
});
createImage((x, y) => {
    return pawn(x, y, ...color2);
});
function bishop(x, y, r, g, b) {
    let a = 0;
    if(rect(x, y, 64, 110-5, 30, 5) && !bevelBottomLeft(x, y, 73) && !bevelBottomRight(x, y, 201)) a = 255;
    if(rect(x, y, 64, 110-15, 30, 5) && !bevelTopLeft(x, y, -134) && !bevelTopRight(x, y, -6)) a = 255;
    if(rect(x, y, 64, 110-18, 22, 5)) a = 255;
    if(rect(x, y, 64, 110-28, 22, 5) && !bevelTopLeft(x, y, -129) && !bevelTopRight(x, y, -1)) a = 255;
    if(rect(x, y, 64, 84, 12, 24)) a = 255;
    if(rect(x, y, 64, 57, 22, 3) && !bevelTopLeft(x, y, -102) && !bevelTopRight(x, y, 26)) a = 255;
    if(rect(x, y, 64, 64, 22, 3) && !bevelBottomLeft(x, y, 23) && !bevelBottomRight(x, y, 151)) a = 255;
    if(circle(x, y, 64, 40, 15) && !circle(x, y, 64+9, 40-7, 6) && !circle(x, y, 82, 35, 6)) a = 255;
    if(circle(x, y, 64, 25, 8)) a = 255;
    let light = false;
    light ||= rect(x, y, 64, 79, 4, 19);
    light ||= circle(x, y, 64, 40, 7) && !circle(x, y, 64+8, 40-5, 14);
    light ||= circle(x, y, 64, 25, 2);
    light ||= rect(x, y, 64, 96.5, 20, 3.5) && !bevelTopLeft(x, y, -145) && !bevelTopRight(x, y, -17)
    light ||= rect(x, y, 64, 82.5, 10, 3.5) && !bevelTopLeft(x, y, -138) && !bevelTopRight(x, y, -10);
    light ||= rect(x, y, 64, 88.5, 11, 3.5);
    light &&= !rect(x, y, 64, 78, 19, 4);
    light &&= !rect(x, y, 64, 91, 19, 3);
    if(light) {
        r += (x - 40) * 1.4 + 20;
        g += (x - 40) * 1.4 + 20;
        b += (x - 40) * 1.4 + 20;
    }
    return [r, g, b, a];
}
createImage((x, y) => {
    return bishop(x, y, ...color1);
});
createImage((x, y) => {
    return bishop(x, y, ...color2);
});
function knight(x, y, r, g, b) {

}
createImage((x, y) => {
    return knight(x, y, ...color1);
});
createImage((x, y) => {
    return knight(x, y, ...color2);
});