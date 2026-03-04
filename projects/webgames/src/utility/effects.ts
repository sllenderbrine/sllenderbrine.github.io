import { Signal } from "../../../shared/EventSignals/EventSignals-v1.0.js";

export function buttonPressEffect(el: HTMLButtonElement, mx: number, my: number, onResolve?: Signal) {
    const rect = el.getBoundingClientRect();
    const circle = document.createElement("div");
    circle.classList.add("button-circle");
    circle.style.left = `${mx - rect.left}px`;
    circle.style.top = `${my - rect.top}px`;
    el.appendChild(circle);
    window.addEventListener("mousedown", e=>{
        circle.remove();
    }, {once:true});
    let onRemove = new Signal();
    let remove = () => {
        circle.remove();
        onRemove.fire();
    }
    let resolve = () => {
        setTimeout(() => {
            circle.style.opacity = "0";
        }, 100);
        setTimeout(() => {
            remove();
        }, 500);
    }
    if(onResolve) {
        let fxEndConn = onResolve.once(() => {
            resolve();
        });
        onRemove.once(() => {
            fxEndConn.disconnect();
        });
    }
    return { circle, resolve, remove, onRemove };
}