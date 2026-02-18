export function loadSVG(path: string): Promise<HTMLElement> {
    return new Promise((resolve, reject) => {
        fetch(path).then(response => {
            if(!response.ok) {
                reject(new Error(`Failed to load SVG: ${response.status} ${response.statusText}`));
                return;
            }
            response.text().then(svgText => {
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
                const svgElement = svgDoc.documentElement;
                resolve(svgElement);
            }).catch(error => {
                reject(new Error(`Failed to parse SVG: ${error.message}`));
            });
        }).catch(error => {
            reject(new Error(`Failed to fetch SVG: ${error.message}`));
        });
    });
}

export function recolorSVG(svgElement: HTMLElement, color: string): void {
    for(const el of [svgElement, ...Array.from(svgElement.querySelectorAll("*"))]) {
        const stroke = el.getAttribute("stroke");
        const fill = el.getAttribute("fill");
        if(stroke && stroke.toLowerCase() !== "none") {
            el.setAttribute("stroke", color);
        }
        if(fill && fill.toLowerCase() !== "none") {
            el.setAttribute("fill", color);
        }
    }
}