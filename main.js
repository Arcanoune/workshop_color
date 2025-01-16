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
let palettes = [];  // Stocke les palettes de couleurs
let currentPaletteIndex = 0;  // Suivi de l'index de la palette actuelle





// couleurs random
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
        return ['#000000', '#000000', '#000000', '#000000'];  // Couleurs par défaut
    }
}



function MainSketch(p) {

    p.setup = function setup() {
        // createCanvas(window.innerWidth / 2, window.innerHeight);
        p.createCanvas(window.innerWidth / 2, window.innerHeight * 0.95, document.getElementById("main-canvas"));
        p.background(255);
        p.textSize(14);


        fetchRandomPalette().then(fetchedColors => {
            colors = fetchedColors;
            palettes.push(colors); // Ajouter la première palette
        });




        // Création des sliders
        createSliders();
        // afficher bouton d'enregistrement
        setupExportButton();
    }



    function createSliders() {
        const container = document.getElementById("range-container");

        // Vérifier si l'élément existe avant de l'utiliser
        if (!container) {
            console.error("L'élément 'range-container' est introuvable !");
            return;  // Ne pas continuer si l'élément est introuvable
        }

        // Ajouter un titre global
        // const title = document.createElement("h2");
        // title.textContent = "Adjust the sliders :";
        // container.appendChild(title);

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



    function setupExportButton() {
        const container = document.getElementById("button-container");
        let button = p.createButton('DOWNLOAD');
        button.mousePressed(exportCSV);
        container.appendChild(button.elt);
    }





    p.draw = function draw() {
        // Dessin des rectangles et autres éléments
        let sets = colors.length;
        let rectWidth = 600;
        let rectHeight = 600;
        let offsetY = 20;

        // dessiner les rectangles
        for (let i = 0; i < sets; i++) {
            p.fill(colors[i]);

            p.noStroke();

            let x = (p.width - rectWidth) / 4;
            let y = window.innerHeight - 60 - rectHeight - offsetY;
            // p.rect(x, y, rectWidth, rectHeight);

            p.rect(x, y, rectWidth, rectHeight, 5);
            rectWidth -= 100;
            rectHeight -= 100;
            offsetY += 20;
        }
    }
}

new p5(MainSketch);






function exportCSV() {
    let csv = "Concept,Value\n";

    concepts.forEach((concept, i) => {
        const slider = document.getElementById(`range-${i}`);
        const value = parseInt(slider.value, 10); // Valeur du slider

        // Calcul des valeurs pour les mots de gauche et de droite
        const leftValue = value <= 5 ? (5 - value) / 5 * 10 : 0; // Remis sur 10
        const rightValue = value >= 5 ? (value - 5) / 5 * 10 : 0; // Remis sur 10

        // Ajout au CSV
        csv += `${concept.left},${leftValue.toFixed(2)}\n`;
        csv += `${concept.right},${rightValue.toFixed(2)}\n`;
    });


    palettes.forEach((palette, index) => {
        palette.forEach((hex, colorIndex) => {
            const hsl = hexToHSL(hex);
            const [h, s, l] = hsl.slice(4, -1).split(',').map(val => val.trim());
            csv += `couleur${index * 4 + colorIndex + 1}, ${h}, ${s}, ${l}\n`;
        });
    });




    // Télécharger le fichier CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "concept_values.csv";
    a.click();
    URL.revokeObjectURL(url);
}

// Fonction de conversion HEX en HSL
function hexToHSL(H) {
    // Convert HEX to RGB first
    let r = 0, g = 0, b = 0;
    if (H.length === 7) {
        r = parseInt(H.slice(1, 3), 16) / 255;
        g = parseInt(H.slice(3, 5), 16) / 255;
        b = parseInt(H.slice(5, 7), 16) / 255;
    }

    // Find min and max values to get lightness
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



// layout aéré
// cycle de 10
