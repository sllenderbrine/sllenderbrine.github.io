class MatrixInput {
    constructor(left=0, top=0) {
        this.containerEl = document.createElement("div");
        document.body.appendChild(this.containerEl);
        this.containerEl.style = `
            position: absolute;
            left: ${left};
            top: ${top};
            width: 256px;
            height: 256px;
        `; 
        this.inputs = [];
        for(let x=0; x<4; x++) {
            for(let y=0; y<4; y++) {
                let input = document.createElement("textarea");
                input.style = `
                    position: absolute;
                    left: ${x/4*100}%;
                    top: ${y/4*100}%;
                    width: 25%;
                    height: 25%;
                    border: 1px solid black;
                    margin: 0px;
                    padding: 0px;
                    border-radius: 0px;
                    text-align: center;
                    align-content: center;
                    resize: none;
                `;
                this.containerEl.appendChild(input);
                this.inputs[y*4 + x] = input;
            }
        }
    }
}

let a = new MatrixInput("10px", "10px");
let b = new MatrixInput("306px", "10px");
let out = new MatrixInput("100px", "306px");

const update = () => {
    const pushSums = (arr, a, b) => {
        if(a == "0") return;
        if(b == "0") return;
        if(a == "") return;
        if(b == "") return;
        arr.push(`(${a})*(${b})`);
    }
    for(let i=0; i<4; i++) {
        for(let j=0; j<4; j++) {
            let sums = [];
            pushSums(sums, a.inputs[0*4+j].value, b.inputs[i*4+0].value);
            pushSums(sums, a.inputs[1*4+j].value, b.inputs[i*4+1].value);
            pushSums(sums, a.inputs[2*4+j].value, b.inputs[i*4+2].value);
            pushSums(sums, a.inputs[3*4+j].value, b.inputs[i*4+3].value);
            let value = sums.join(" + ");
            if(value.length == 0) value = "0";
            out.inputs[i*4 + j].value = value;
        }
    }
}

function createBtn(left, top, text) {
    let btn = document.createElement("button");
    btn.style = `
        position: absolute;
        top: ${top};
        left: ${left};
        width: 100px;
        height: 28px;
        background-color: rgb(62, 71, 79);
        color: white;
        font-family: Arial
        font-size: 16px;
        text-align: center;
        border: 2px solid white;
        outline: 2px solid black;
        cursor: pointer;
        user-select: none;
    `;
    document.body.appendChild(btn);
    btn.textContent = text;
    return btn;
}

let expand = createBtn("100px", "600px", "Expand");
expand.addEventListener("click", e => {
    update();
});

let clear = createBtn("100px", "634px", "Clear Top Two");
clear.addEventListener("click", e => {
    for(const input of a.inputs) { input.value = ""; }
    for(const input of b.inputs) { input.value = ""; }
});