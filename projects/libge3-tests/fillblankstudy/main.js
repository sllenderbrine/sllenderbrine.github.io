import { ArrayUtils, Color, EMath, Signal, UiBtnHoverFxSolidColor, UiButton } from "../../libge3/libge3_v20260416.js";
import { IconLibrary } from "../../libge3/libge3icons_v20260416.js";

IconLibrary.loadAllIcons().then(() => {
    let btn = new UiButton();
    new UiBtnHoverFxSolidColor(btn, new Color("rgb(255, 255, 255)"), new Color("rgb(236, 236, 236)"));
    btn.textContent = "Load Quiz";
    btn.addIcon(IconLibrary.getIcon("folder"));
    btn.containerEl.style.left = "50%";
    btn.containerEl.style.top = "50%";
    btn.containerEl.style.transform = "translate(-50%, -50%)";
    btn.containerEl.style.position = "absolute";
    btn.buttonEl.onclick = () => {
        let a = document.createElement("input");
        a.type = "file";
        a.oninput = e => {
            let file = a.files[0];
            const reader = new FileReader();
            reader.onload = e => {
                let content = e.target.result;
                btn.remove();
                content = content.replaceAll("\r", "");
                startQuiz(content);
            }
            reader.readAsText(file);
        }
        a.click();
    }
});

function decodeQuiz(content) {
    let lines = content.split("\n");
    let chapters = {};
    let questions = [];
    let currentChapter = "default";
    for(let i=0; i<lines.length; i++) {
        let line = lines[i];
        if(line.startsWith("[") && line.endsWith("]")) {
            currentChapter = line.substring(1, line.length-1);
            continue;
        }
        if(!chapters[currentChapter])
            chapters[currentChapter] = [];
        chapters[currentChapter].push(line);
        questions.push({line, chapter: currentChapter});
    }
    return {chapters, questions};
}

function decodeQuestion(content) {
    let parts = [];
    let normalStr = "";
    let inputStr = "";
    for(let i=0; i<content.length; i++) {
        let char = content.charAt(i);
        if(inputStr.length == 0) {
            if(char == "$") {
                inputStr += char;
            } else {
                normalStr += char;
            }
        } else if(inputStr.length == 1) {
            if(char == "{") {
                inputStr += char;
            } else {
                normalStr += inputStr;
                inputStr = "";
                if(char == "$") {
                    inputStr += char;
                } else {
                    normalStr += char;
                }
            }
        } else if(inputStr.length >= 2) {
            inputStr += char;
            if(char == "}") {
                if(normalStr.length > 0)
                    parts.push(normalStr);
                parts.push(inputStr);
                normalStr = "";
                inputStr = "";
            }
        }
    }
    if(normalStr.length > 0)
        parts.push(normalStr);
    return parts;
}

function createQuestion(content) {
    let column = document.createElement("div");
    column.style = `
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        display: column;
        width: fit-content;
        height: fit-content;
    `;
    document.body.appendChild(column);
    let container = document.createElement("div");
    container.style = `
        position: relative;
        width: fit-content;
        height: fit-content;
    `;
    column.appendChild(container);
    let submitContainer = document.createElement("div");
    submitContainer.style = `
        position: relative;
        width: fit-content;
        height: fit-content;
        margin-top: 12px;
    `;
    column.appendChild(submitContainer);
    let skipEvent = new Signal();
    let backEvent = new Signal();
    let wrongEvent = new Signal();
    let correctEvent = new Signal();
    let submitBtn = new UiButton();
    new UiBtnHoverFxSolidColor(submitBtn, new Color("rgb(255, 255, 255)"), new Color("rgb(236, 236, 236)"));
    submitBtn.textContent = "Submit";
    submitBtn.containerEl.style.display = "inline-flex";
    submitContainer.appendChild(submitBtn.containerEl);
    let backBtn = new UiButton();
    new UiBtnHoverFxSolidColor(backBtn, new Color("rgb(255, 255, 255)"), new Color("rgb(236, 236, 236)"));
    backBtn.textContent = "Back";
    backBtn.containerEl.style.display = "inline-flex";
    backBtn.containerEl.style.marginLeft = "8px";
    submitContainer.appendChild(backBtn.containerEl);
    let skipBtn = new UiButton();
    new UiBtnHoverFxSolidColor(skipBtn, new Color("rgb(255, 255, 255)"), new Color("rgb(236, 236, 236)"));
    skipBtn.textContent = "Next";
    skipBtn.containerEl.style.display = "inline-flex";
    skipBtn.containerEl.style.marginLeft = "8px";
    submitContainer.appendChild(skipBtn.containerEl);
    let parts = decodeQuestion(content);
    for(let p of parts) {
        if(p.startsWith("${")) {
            let answerOriginal = p.substring(2, p.length-1);
            let answer = answerOriginal.toLowerCase().trim();
            if(answer == "false" || answer == "true") {
                let btn = new UiButton();
                btn.textContent = "False";
                btn.containerEl.style.display = "inline-flex";
                btn.containerEl.style.width = "60px";
                let btnHoverFx = new UiBtnHoverFxSolidColor(btn, new Color("rgb(255, 255, 255)"), new Color("rgb(236, 236, 236)"));
                container.appendChild(btn.containerEl);
                btn.buttonEl.onclick = () => {
                    if(btn.textContent == "False")
                        btn.textContent = "True";
                    else
                        btn.textContent = "False";
                }
                submitBtn.buttonEl.addEventListener("click", () => {
                    if(btn.textContent.toLowerCase().trim() == answer) {
                        btnHoverFx.remove();
                        btn.containerEl.style.backgroundColor = "rgb(49, 138, 83)";
                        btn.labelEl.style.color = "white";
                        correctEvent.fire();
                    } else {
                        btnHoverFx.remove();
                        btn.containerEl.style.backgroundColor = "rgb(148, 32, 32)";
                        btn.labelEl.style.color = "white";
                        btn.containerEl.title = answerOriginal;
                        wrongEvent.fire();
                    }
                });
            } else if(answer.includes("]:[")) {
                let answerParts = answer.split("]:[");
                let answerCorrects = answerParts[0].substring(1).split(",");
                let answerOptions = answerParts[1].substring(0, answerParts[1].length-1).split(",");
                let optionsDiv = document.createElement("div");
                optionsDiv.style = `
                    width: 100%;
                    height: fit-content;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                `;
                submitContainer.before(optionsDiv);
                let abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                for(let i=0; i<answerOptions.length; i++) {
                    let option = answerOptions[i];
                    let letter = abc.charAt(i);
                    let abtn = new UiButton();
                    abtn.containerEl.style.justifyContent = "flex-start";
                    abtn.textContent = `${letter}. ` + option;
                    optionsDiv.appendChild(abtn.containerEl);
                    abtn.containerEl.style.width = "100%";
                    let abtnHoverFx = new UiBtnHoverFxSolidColor(abtn, new Color("rgb(255, 255, 255)"), new Color("rgb(236, 236, 236)"));
                    let selected = false;
                    abtn.buttonEl.onclick = () => {
                        selected = !selected;
                        abtn.labelEl.style.color = "black";
                        if(selected) {
                            abtnHoverFx.color = new Color("rgb(129, 209, 255)");
                            abtnHoverFx.hoverColor = new Color("rgb(93, 173, 219)");
                        } else {
                            abtnHoverFx.color = new Color("rgb(255, 255, 255)");
                            abtnHoverFx.hoverColor = new Color("rgb(236, 236, 236)");
                        }
                    }
                    submitBtn.buttonEl.addEventListener("click", () => {
                        if(selected && (answerCorrects.indexOf(i.toString()) > -1)) {
                            abtnHoverFx.color = new Color("rgb(49, 138, 83)");
                            abtnHoverFx.hoverColor = abtnHoverFx.color;
                            abtn.labelEl.style.color = "white";
                            correctEvent.fire();
                        } else if(!selected && (answerCorrects.indexOf(i.toString()) > -1)) {
                            abtnHoverFx.color = new Color("rgb(184, 85, 46)");
                            abtnHoverFx.hoverColor = abtnHoverFx.color;
                            abtn.labelEl.style.color = "white";
                            wrongEvent.fire();
                        } else if(selected && (answerCorrects.indexOf(i.toString()) == -1)) {
                            abtnHoverFx.color = new Color("rgb(148, 32, 32)");
                            abtnHoverFx.hoverColor = abtnHoverFx.color;
                            abtn.labelEl.style.color = "white";
                            wrongEvent.fire();
                        }
                    });
                }
            } else {
                let input = document.createElement("input");
                input.type = "text";
                input.style.height = "24px";
                input.style.display = "inline-flex";
                input.style.width = "120px";
                input.style.justifyContent = "center";
                input.style.alignItems = "center";
                input.style.border = "1px solid black";
                input.style.borderRadius = "4px";
                container.appendChild(input);
                submitBtn.buttonEl.addEventListener("click", () => {
                    if(input.value.toLowerCase().trim() == answer) {
                        input.style.backgroundColor = "rgb(49, 138, 83)";
                        input.style.color = "white";
                        correctEvent.fire();
                    } else {
                        input.style.backgroundColor = "rgb(148, 32, 32)";
                        input.style.color = "white";
                        input.title = answerOriginal;
                        wrongEvent.fire();
                    }
                });
            }
        } else {
            let label = document.createElement("span");
            label.textContent = p;
            container.appendChild(label);
        }
    }
    skipBtn.buttonEl.addEventListener("click", () => {
        skipEvent.fire();
    });
    backBtn.buttonEl.addEventListener("click", () => {
        backEvent.fire();
    });
    let remove = () => {
        column.remove();
    }
    return {skipEvent, backEvent, remove, wrongEvent, correctEvent};
}

function startQuiz(content) {
    let quiz = decodeQuiz(content);
    console.log(quiz);
    let chapterView = document.createElement("div");
    chapterView.style = `
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        width: 70vw;
        height: 180px;
        border: 1px solid black;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
    `;
    document.body.appendChild(chapterView);
    let chapterViewContent = document.createElement("div");
    chapterViewContent.style = `
        position: relative;
        width: 100%;
        height: 100%;
        overflow-y: hidden;
        overflow-x: scroll;
        display: flex;
        flex-direction: row;
        align-item: center;
        justify-content: flex-start;
        gap: 8px;
    `;
    chapterView.appendChild(chapterViewContent);
    let chapterViewTools = document.createElement("div");
    chapterViewTools.style = `
        position: absolute;
        width: 100%;
        height: 30px;
        bottom: -40px;
        display: flex;
        flex-direction: row;
        align-item: center;
        justify-content: flex-start;
        gap: 8px;
    `;
    chapterView.appendChild(chapterViewTools);
    let filterTrueFalse = new UiButton();
    filterTrueFalse.textContent = "Remove T/F (OFF)";
    new UiBtnHoverFxSolidColor(filterTrueFalse, new Color("rgb(255, 255, 255)"), new Color("rgb(236, 236, 236)"));
    chapterViewTools.appendChild(filterTrueFalse.containerEl);
    let enableAll = new UiButton();
    enableAll.textContent = "Enable all";
    new UiBtnHoverFxSolidColor(enableAll, new Color("rgb(255, 255, 255)"), new Color("rgb(236, 236, 236)"));
    chapterViewTools.appendChild(enableAll.containerEl);
    let disableAll = new UiButton();
    disableAll.textContent = "Disable all";
    new UiBtnHoverFxSolidColor(disableAll, new Color("rgb(255, 255, 255)"), new Color("rgb(236, 236, 236)"));
    chapterViewTools.appendChild(disableAll.containerEl);
    let enabledChapters = {};
    let indices = [];
    let shouldFilterTF = false;
    let indicesIndex = 0;
    let currentQuestion;
    let nextQuestion = () => {
        currentQuestion = createQuestion(`(${indicesIndex}/${indices.length})  ` + quiz.questions[indices[indicesIndex]].line);
        currentQuestion.skipEvent.connect(() => {
            currentQuestion.remove();
            indicesIndex++;
            if(indicesIndex >= indices.length) {
                indicesIndex = 0;
                ArrayUtils.shuffleSelf(indices);
            }
            nextQuestion();
        });
        currentQuestion.backEvent.connect(() => {
            currentQuestion.remove();
            indicesIndex--;
            if(indicesIndex < 0) {
                indicesIndex = 0;
                ArrayUtils.shuffleSelf(indices);
            }
            nextQuestion();
        })
    }
    let updateIndices = () => {
        if(currentQuestion) {
            currentQuestion.remove();
            currentQuestion = null;
        }
        indices = [];
        for(let i=0; i<quiz.questions.length; i++) {
            let line = quiz.questions[i].line.toLowerCase();
            let chapterName = quiz.questions[i].chapter;
            if(shouldFilterTF && (line.includes("${true}") || line.includes("${false}"))) {
                continue;
            }
            if(enabledChapters[chapterName] != true) {
                continue;
            }
            indices.push(i);
        }
        ArrayUtils.shuffleSelf(indices);
        currentQuestion = null;
        indicesIndex = 0;
        if(indices.length == 0)
            return;
        nextQuestion();
    }
    for(let name in quiz.chapters) {
        let chapterItem = document.createElement("div");
        chapterItem.style = `
            width: 160px;
            height: 160px;
            flex: 0 0 auto;
            background-color: rgb(46, 48, 49);
        `;
        chapterViewContent.appendChild(chapterItem);
        let chapterItemTitle = document.createElement("div");
        chapterItemTitle.style = `
            color: black;
            font-size: 24px;
            width: 100%;
            height: 30px;
            padding: 8px;
            font-family: Arial;
            color: white;
        `;
        chapterItemTitle.textContent = name;
        chapterItem.appendChild(chapterItemTitle);
        enabledChapters[name] = false;
        let activateBtn = new UiButton();
        activateBtn.textContent = "Enable";
        new UiBtnHoverFxSolidColor(activateBtn, new Color("rgb(255, 255, 255)"), new Color("rgb(236, 236, 236)"));
        activateBtn.buttonEl.onclick = () => {
            if(enabledChapters[name]) {
                enabledChapters[name] = false;
                activateBtn.textContent = "Enable";
                chapterItem.style.backgroundColor = "rgb(46, 48, 49)";
            } else {
                enabledChapters[name] = true;
                activateBtn.textContent = "Disable";
                chapterItem.style.backgroundColor = "rgb(75, 154, 201)";
            }
            updateIndices();
        }
        chapterItem.appendChild(activateBtn.containerEl);
        enableAll.buttonEl.addEventListener("click", () => {
            enabledChapters[name] = true;
            activateBtn.textContent = "Disable";
            chapterItem.style.backgroundColor = "rgb(75, 154, 201)";
            updateIndices();
        });
        disableAll.buttonEl.addEventListener("click", () => {
            enabledChapters[name] = false;
            activateBtn.textContent = "Enable";
            chapterItem.style.backgroundColor = "rgb(46, 48, 49)";
            updateIndices();
        });
    }
    filterTrueFalse.buttonEl.onclick = () => {
        if(filterTrueFalse.textContent.includes("OFF")) {
            filterTrueFalse.textContent = "Remove T/F (ON)";
            shouldFilterTF = true;
            updateIndices();
        } else {
            filterTrueFalse.textContent = "Remove T/F (OFF)";
            shouldFilterTF = false;
            updateIndices();
        }
    }
    updateIndices();
}