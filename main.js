let colors = ["yellow", "blue", "red", "orange"];

// Dimensions des curseurs et marges
let sliderWidth = 300;
let sliderHeight = 20;
let margin = 50;


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

// Tableau des curseurs
let sliders = [];

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    noLoop();
    textSize(14);

    // Initialisation des curseurs
    for (let i = 0; i < concepts.length; i++) {
        let y = margin + i * (sliderHeight + margin);
        let slider = createSlider(0, 1, 0.5, 0.01);
        slider.position(margin, y);
        slider.size(sliderWidth);
        sliders.push(slider);
    }
}

function draw() {
    let sets = 4;
    let rectWidth = 600;
    let rectHeight = 600;
    let offsetY = 20;
    background(240);


    for (let i = 0; i < sets; i++) {
        fill(colors[i]);
        noStroke();

        let x = (width - rectWidth) / 2;
        let y = height - rectHeight - offsetY;

        rect(x, y, rectWidth, rectHeight);
        rectWidth -= 100;
        rectHeight -= 100;
        offsetY += 20;

        // textFont('impact');
        // textAlign(CENTER, CENTER);
        // text("texte", height/2, width/2);
        // textSize(128);
    }


    // Dessiner chaque curseur et ses concepts
    for (let i = 0; i < concepts.length; i++) {
        let y = margin + i * (sliderHeight + margin);
        let slider = sliders[i];
        let value = slider.value();

        // Afficher les noms des concepts
        textAlign(RIGHT, CENTER);
        text(concepts[i].left, margin - 10, y + sliderHeight / 2);
        textAlign(LEFT, CENTER);
        text(concepts[i].right, margin + sliderWidth + 10, y + sliderHeight / 2);

        // Afficher les valeurs calculées
        textAlign(CENTER, CENTER);
        fill(0);
        text(`Left: ${nf(1 - value, 1, 2)}, Right: ${nf(value, 1, 2)}`, width / 2, y + sliderHeight / 2 + 20);
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
function keyPressed() {
    if (key === 'E' || key === 'e') {
        exportCSV();
    }
}
