// Liste des paires de concepts
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
let mySelect;




// couleurs random
async function fetchRandomPalette() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const modes = ['analogic-complement', 'triad', 'quad'];
    const randomMode = modes[Math.floor(Math.random() * modes.length)];
    const length = mySelect.selected();
    console.log(length);

    const response = await fetch(`https://www.thecolorapi.com/scheme?hex=${randomColor}&mode=${randomMode}&count=${length}`);
    const data = await response.json();
    return data.colors.map(color => color.hex.value);
}


function setup() {
    // createCanvas(window.innerWidth / 2, window.innerHeight);
    const canvasParent = document.getElementById('canvas-container');
    const canvas = createCanvas(window.innerWidth/2, window.innerHeight);
    canvas.parent(canvasParent);
    background(0);
    textSize(14);

    // Initialisation du select
    mySelect = createSelect();
    mySelect.position(250, 250);
    mySelect.option('4');
    mySelect.option('5');
    mySelect.option('6');
    mySelect.selected('4');

    fetchRandomPalette(4).then(fetchedColors => {
        colors = fetchedColors;
    });

    mySelect.changed(() => {
        fetchRandomPalette().then(fetchedColors => {
            colors = fetchedColors;
        });
    });

    // afficher bouton d'enregistrement
    setupExportButton();
    // Création des sliders
    createSliders();
}



function createSliders() {
    const container = document.getElementById("range-container");
    for (let i = 0; i < concepts.length; i++) {
        const div = document.createElement("div");
        div.classList.add("range");

        const input = document.createElement("input");
        input.type = "range";
        input.id = `range-${i}`;
        input.name = "range";
        input.min = "0";
        input.max = "10";
        input.range = "1";

        const label = document.createElement("label");
        label.htmlFor = `range-${i}`;
        label.textContent = `Range for ${concepts[i].left} - ${concepts[i].right}`;

        div.appendChild(input);
        div.appendChild(label);
        container.appendChild(div);
    }
}



function draw() {
    // Dessin des rectangles et autres éléments
    let sets = colors.length;
    let rectWidth = 600;
    let rectHeight = 600;
    let offsetY = 20;

    // dessiner les rectangles
    for (let i = 0; i < sets; i++) {
        fill(colors[i]);
        noStroke();

        let x = (width - rectWidth) / 4;
        let y = window.innerHeight - rectHeight - offsetY;
        rect(x, y, rectWidth, rectHeight);

        rect(x - 150, y - 50, rectWidth, rectHeight);
        rectWidth -= 100;
        rectHeight -= 100;
        offsetY += 20;
    }
}










// Fonction d’exportation des valeurs et des couleurs
function exportCSV() {
    let csv = "Concept,Value\n";
    sliders.forEach((slider, i) => {
        let value = slider.value();
        csv += `${concepts[i].left},${nf(1 - value, 1, 2)}\n`;
        csv += `${concepts[i].right},${nf(value, 1, 2)}\n`;
    });
    saveStrings([csv], "concept_values.csv");
}

// Bouton d'exportation
function setupExportButton() {
    let button = createButton('Enregistrer');
    button.mousePressed(exportCSV);
}