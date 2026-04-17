import { Color, generateIcon2D, IconPolygon2D, UiButton, UiButtonBackgroundColorHoverEffect, UiButtonIcon } from "../../libge3/libge3_v20260416.js";


let squareIcon = generateIcon2D(64, 64, ctx => {
    IconPolygon2D.rect(0.5, 0.5, 0.5, 0.5).bevelAllSelf(0.1).bevelAllSelf(0.05).drawFill(ctx.selectedLayer, "black");
    IconPolygon2D.rect(0.5, 0.5, 0.35, 0.35).bevelAllSelf(0.07).bevelAllSelf(0.04).drawFill(ctx.selectedLayer, "white");
    ctx.brightnessToOpacity(true);
});

let btn = new UiButton();
squareIcon.then(url => {
    let icon = new UiButtonIcon(btn, url, "prefix");
})
new UiButtonBackgroundColorHoverEffect(btn, new Color("rgb(255, 255, 255)"), new Color("rgb(197, 197, 197)"))