import * as libge3 from "../libge3_v20260426/libge3_v20260424.js";
const { Slider, Checkbox, Dropdown } = libge3;

new Slider(0, 100, 1, 33, 'horizontal');
new Checkbox();
new Dropdown(["Option A", "Option B", "Option C"], 0);