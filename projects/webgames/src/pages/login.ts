import { Signal } from "../../../shared/EventSignals/EventSignals-v1.0.js";
import { buttonPressEffect } from "../utility/effects.js";

export default class LoginPrompt {
    createClicked = new Signal();
    joinClicked = new Signal();
    createResolved = new Signal();
    joinResolved = new Signal();
    container: HTMLDivElement;
    nameInput: HTMLInputElement;
    joinBtn: HTMLButtonElement;
    createBtn: HTMLButtonElement;
    constructor() {
        this.container = document.createElement("div");
        this.container.classList.add("login");
        this.container.innerHTML = `
            <h2> Web Games </h2>
            <span>
                <input id="name-input" placeholder="Enter display name..." />
            </span>
            <span>
                <button id="create-btn">Create Room</button>
                <button id="join-btn">Join Room</button>
            </span>
        `;
        this.nameInput = this.container.querySelector("#name-input")!;
        this.joinBtn = this.container.querySelector("#join-btn")!;
        this.createBtn = this.container.querySelector("#create-btn")!;
        this.joinBtn.onclick = e => {
            buttonPressEffect(this.joinBtn, e.clientX, e.clientY, this.joinResolved);
            this.joinClicked.fire();
        }
        this.createBtn.onclick = e => {
            buttonPressEffect(this.createBtn, e.clientX, e.clientY, this.createResolved);
            this.createClicked.fire();
        }
        document.body.appendChild(this.container);
    }
}