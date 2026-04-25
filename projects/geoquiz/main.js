class MapCountry {
    static countries = [];
    static countryByName = {};
    constructor(name) {
        this.name = name;
        this.paths = [];
        this.hasCoverage = true;
        this.isHovering = false;
        this.isSelected = false;
        MapCountry.countries.push(this);
        MapCountry.countryByName[name] = this;
    }
    static getCountry(name) {
        return this.countryByName[name];
    }
    static resetSelected() {
        for(const country of this.countries) {
            country.isSelected = false;
            country.updateColor();
        }
    }
    updateColor() {
        for(const path of this.paths) {
            if(this.coverage) {
                if(this.isSelected) {
                    path.style.fill = this.isHovering ? "rgb(228, 132, 156)" : "rgb(255, 142, 189)";
                } else {
                    path.style.fill = this.isHovering ? "rgb(255, 228, 179)" : "";
                }
            } else {
                path.style.fill = "rgb(160, 160, 160)";
                path.style.stroke = "rgb(160, 160, 160)";
                path.style.strokeWidth = "2";
                path.style.cursor = "default";
            }
        }
    }
}

async function loadMapCountries() {
    const container = document.createElement("div");
    document.body.appendChild(container);
    container.style = "width:100%;height:100%;display:flex;align-items:center;justify-content:center;";
    
    let svgsByCountryName = {};
    const svgData = await (await fetch("./resources/world.svg")).text();
    container.innerHTML = svgData;
    const svg = container.querySelector("svg");
    svg.style.width = "fit-content";
    svg.style.height = "fit-content";
    svg.style.maxWidth = "80%";
    svg.style.maxHeight = "80%";
    svg.style.objectFit = "contain";
    for(const path of svg.querySelectorAll("path")) {
        const countryName = path.classList.value || path.getAttribute("name");
        let country = MapCountry.getCountry(countryName);
        if(country === undefined) {
            country = new MapCountry(countryName);
        }
        country.paths.push(path);
        path.style.cursor = "pointer";
    }
    const equator = document.createElement("div");
    equator.style = `
        width: 100%;
        height: 0px;
        border: 1px dashed rgba(255, 255, 255, 0.5);
        top: 50%;
        left: 50%;
        position: absolute;
        transform: translate(-50%, -50%);
    `;
    container.appendChild(equator);
    svg.addEventListener("mouseover", e => {
        if(e.target.tagName === "path") {
            let countryName = e.target.classList.value || e.target.getAttribute("name");
            let country = MapCountry.getCountry(countryName);
            if(country === undefined)
                return;
            country.isHovering = true;
            country.updateColor();
        }
    });
    svg.addEventListener("mouseout", e => {
        if(e.target.tagName === "path") {
            let countryName = e.target.classList.value || e.target.getAttribute("name");
            let country = MapCountry.getCountry(countryName);
            if(country === undefined)
                return;
            country.isHovering = false;
            country.updateColor();
        }
    });
    svg.addEventListener("mousedown", e => {
        if(e.target.tagName === "path") {
            let countryName = e.target.classList.value || e.target.getAttribute("name");
            let country = MapCountry.getCountry(countryName);
            if(country === undefined)
                return;
            country.isSelected ^= true;
            country.updateColor();
        }
    })

    const countriesData = await (await fetch("./resources/countries.txt")).text();
    for(const countryName in {...MapCountry.countryByName}) {
        const country = MapCountry.getCountry(countryName);
        if(country === undefined)
            continue;
        if(countriesData.includes(countryName)) {
            country.coverage = true;
        } else {
            country.coverage = false;
        }
        country.updateColor();
    }
}

async function startQuiz() {
    let img = new Image();
    img.src = "./resources/brazil stop sign.png";
    img.style = `
        position: absolute;
        left: 10px;
        bottom: 10px;
        width: 400px;
        height: 400px;
        max-width: 35vmin;
        max-height: 35vmin;
        object-fit: contain;
        background-color: black;
        border: 2px solid black;
    `;
    document.body.appendChild(img);
}

loadMapCountries();

startQuiz();