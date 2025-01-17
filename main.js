let concepts = [
    { left: "passive", right: "active" },
    { left: "dull", right: "bright" },
    { left: "cold", right: "warm" },
    { left: "wet", right: "dry" },
    { left: "sugary", right: "bitter" },
    { left: "mild", right: "acid" },
    { left: "silent", right: "noisy" },
    { left: "harsh", right: "harmonious" }
];
let colors = [];



async function fetchRandomPalette() {
    try {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        const modes = ['analogic-complement', 'triad', 'quad'];
        const randomMode = modes[Math.floor(Math.random() * modes.length)];

        const response = await fetch(`https://www.thecolorapi.com/scheme?hex=${randomColor}&mode=${randomMode}&count=4`);
        const data = await response.json();
        return data.colors.map(color => color.hex.value);
    } catch (error) {
        console.error("Erreur lors de la récupération de la palette:", error);
        return ['#000000', '#000000', '#000000', '#000000'];
    }
}



function MainSketch(p) {

    p.setup = function setup() {
        p.createCanvas(window.innerWidth / 2, window.innerHeight * 0.95, document.getElementById("main-canvas"));
        p.textSize(14);

        fetchRandomPalette().then(fetchedColors => {
            colors = fetchedColors;
            palettes.push(colors);
        });

        createSliders();
        setupPaletteButton();
    }



    function createSliders() {
        const container = document.getElementById("range-container");

        if (!container) {
            console.error("L'élément 'range-container' est introuvable !");
            return;
        }

        for (let i = 0; i < concepts.length; i++) {
            const div = document.createElement("div");
            div.classList.add("range");

            const input = document.createElement("input");
            input.type = "range";
            input.id = `range-${i}`;
            input.name = "range";
            input.min = "0";
            input.max = "10";
            input.step = "1";
            input.value = "5";

            const label = document.createElement("label");
            label.htmlFor = `range-${i}`;
            label.innerHTML = `<span>${concepts[i].left}</span><span>${concepts[i].right}</span>`; // Mots de chaque côté

            div.appendChild(label);
            div.appendChild(input);
            container.appendChild(div);
        }
    }


    p.draw = function draw() {
        let sets = colors.length;
        let rectWidth = 600;
        let rectHeight = 600;
        let offsetY = 20;

        for (let i = 0; i < sets; i++) {
            p.fill(colors[i]);
            p.noStroke();

            let x = (p.width - rectWidth) / 4;
            let y = window.innerHeight - 60 - rectHeight - offsetY;

            p.rect(x, y, rectWidth, rectHeight, 5);
            rectWidth -= 100;
            rectHeight -= 100;
            offsetY += 20;
        }
    }
}

new p5(MainSketch);

let sliderValues = [];
let conceptSliderValues = [];
let palettes = [];
let currentPaletteIndex = 0;

function setupPaletteButton() {
    const container = document.getElementById("button-container");
    if (!container) {
        console.error("L'élément 'button-container' est introuvable !");
        return;
    }

    let button = document.createElement('button');
    button.textContent = 'NEXT';
    button.id = 'palette-button';
    container.appendChild(button);

    button.addEventListener('click', async () => {
        saveSliderValues();
        conceptSliderValues[currentPaletteIndex] = [...sliderValues];

        if (currentPaletteIndex < 9) {
            currentPaletteIndex++;
            const fetchedColors = await fetchRandomPalette();
            colors = fetchedColors;
            palettes.push(colors);

            resetSliders();

            if (currentPaletteIndex === 9) {
                button.textContent = "DOWNLOAD";
            }
        } else {
            exportCSV();
        }
    });

}



function exportCSV() {
    let csv = "Palettes,";

    concepts.forEach(concept => {
        csv += `${concept.left},${concept.right},`;
    });

    csv += "Couleurs\n"; 

    palettes.forEach((palette, paletteIndex) => {
        csv += `Palette ${paletteIndex + 1},`;

        conceptSliderValues[paletteIndex].forEach((value, conceptIndex) => {
            let leftValue = value <= 5 ? (5 - value) / 5 * 100 : 0;
            let rightValue = value >= 5 ? (value - 5) / 5 * 100 : 0;

            if (leftValue > 0) rightValue = 100 - leftValue;
            if (rightValue > 0) leftValue = 100 - rightValue;

            csv += `${leftValue.toFixed(0)},${rightValue.toFixed(0)},`;
        });

        const combinedColors = palette.map(hex => hexToHSL(hex).replace(/ /g, "")).join(",");
        csv += `"${combinedColors}"\n`; 
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "concept_values.csv";
    a.click();
    URL.revokeObjectURL(url);
}



function saveSliderValues() {
    sliderValues = [];
    for (let i = 0; i < concepts.length; i++) {
        const slider = document.getElementById(`range-${i}`);
        if (slider) {
            sliderValues[i] = parseInt(slider.value, 10) || 5;
        }
    }
}

function resetSliders() {
    for (let i = 0; i < concepts.length; i++) {
        const slider = document.getElementById(`range-${i}`);
        if (slider) {
            slider.value = 5;
        }
    }
}

document.querySelectorAll('input[type="range"]').forEach((slider, i) => {
    slider.addEventListener('input', () => saveSliderValues());
});
saveSliderValues();


function hexToHSL(H) {
    let r = 0, g = 0, b = 0;
    if (H.length === 7) {
        r = parseInt(H.slice(1, 3), 16) / 255;
        g = parseInt(H.slice(3, 5), 16) / 255;
        b = parseInt(H.slice(5, 7), 16) / 255;
    }

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `hsl(${h}, ${s}%, ${l}%)`;
}