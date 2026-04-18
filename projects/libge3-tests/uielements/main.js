import { Color, UiButton, UiBtnHoverFxSolidColor } from "../../libge3/libge3_v20260416.js";
import { IconLibrary } from "../../libge3/libge3icons_v20260416.js";

let btn = new UiButton();
new UiBtnHoverFxSolidColor(btn, new Color("rgb(255, 255, 255)"), new Color("rgb(197, 197, 197)"))

IconLibrary.loadAllIcons().then(() => {
    btn.addIcon(IconLibrary.getIcon("circle"));
});