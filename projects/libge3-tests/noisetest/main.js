import { Color, generateIcon2D, Noise } from "../../libge3/libge3_v20260416.js";

let offsetAmp = 1;
let search = undefined;

generateIcon2D(300, 300, ctx => {
    ctx.map((x, y, getColor) => {
        let data = Noise.getWorley2DAt(x/32, y/32, 0, offsetAmp, search);
        let color = new Color();
        color.val = (data.minDist2 - data.minDist)*100;
        return color;
    });
}).then(url => {
    let img = new Image();
    img.src = url;
    document.body.appendChild(img);
});

generateIcon2D(300, 300, ctx => {
    ctx.map((x, y, getColor) => {
        let data = Noise.getWorley2DAt(x/32, y/32, 0, offsetAmp, search);
        let color = Color.decimalToRGB(data.value);
        return color;
    });
}).then(url => {
    let img = new Image();
    img.src = url;
    document.body.appendChild(img);
});

generateIcon2D(300, 300, ctx => {
    ctx.map((x, y, getColor) => {
        let data = Noise.getWorley2DAt(x/32, y/32, 0, offsetAmp, search);
        let color = Color.decimalToRGB(data.value2);
        return color;
    });
}).then(url => {
    let img = new Image();
    img.src = url;
    document.body.appendChild(img);
});

generateIcon2D(300, 300, ctx => {
    ctx.map((x, y, getColor) => {
        let data = Noise.getWorley2DAt(x/32, y/32, 0, offsetAmp, search);
        let color = new Color();
        color.val = (data.minDist)*100;
        return color;
    });
}).then(url => {
    let img = new Image();
    img.src = url;
    document.body.appendChild(img);
});

let gradients = Noise.generatePerlin2DGradients();

generateIcon2D(300, 300, ctx => {
    ctx.map((x, y, getColor) => {
        let val = Noise.getPerlin2DValueAt(x/32, y/32, 0, gradients);
        let color = new Color();
        color.val = val*100;
        return color;
    });
}).then(url => {
    let img = new Image();
    img.src = url;
    document.body.appendChild(img);
});

generateIcon2D(300, 300, ctx => {
    ctx.map((x, y, getColor) => {
        let val = Noise.getPerlin2DValueAt(x/32, y/32, 0, gradients);
        let color = new Color();
        color.val = Math.abs(val - 0.5) * 300;
        return color;
    });
}).then(url => {
    let img = new Image();
    img.src = url;
    document.body.appendChild(img);
});

generateIcon2D(300, 300, ctx => {
    ctx.map((x, y, getColor) => {
        let r = 0;
        let g = 0;
        let b = 0;
        for(let xo=-2; xo<=2; xo++) {
            for(let yo=-2; yo<=2; yo++) {
                let rx = Noise.randomConstant3(x+xo, y+yo, 0) - 0.5;
                let ry = Noise.randomConstant3(x+xo, y+yo, 0+1) - 0.5;
                let color = Color.decimalToRGB(Noise.getWorley2DAt(x/32 + xo/8 + rx/16, y/32 + yo/8 + ry/16, 0, offsetAmp, search).value2);
                r += color.r;
                g += color.g;
                b += color.b;
            }
        }
        r /= 25;
        g /= 25;
        b /= 25;
        let color = new Color(r, g, b);
        return color;
    });
}).then(url => {
    let img = new Image();
    img.src = url;
    document.body.appendChild(img);
});