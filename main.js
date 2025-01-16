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
// let mySelect;




// couleurs random
async function fetchRandomPalette() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const modes = ['analogic-complement', 'triad', 'quad'];
    const randomMode = modes[Math.floor(Math.random() * modes.length)];
    // const length = mySelect.selected();
    // console.log(length);

    const response = await fetch(`https://www.thecolorapi.com/scheme?hex=${randomColor}&mode=${randomMode}&count=4`);
    const data = await response.json();
    return data.colors.map(color => color.hex.value);
}


function MainSketch(p) {

    p.setup = function setup() {
        // createCanvas(window.innerWidth / 2, window.innerHeight);
        p.createCanvas(window.innerWidth / 2, window.innerHeight*0.95, document.getElementById("main-canvas"));
        p.background(255);
        p.textSize(14);

        // // Initialisation du select
        // mySelect = p.createSelect();
        // mySelect.position(p.width / 2 - 50, 30); // Centré horizontalement et en haut
        // mySelect.option('4');
        // mySelect.option('5');
        // mySelect.option('6');
        // mySelect.selected('4');

        fetchRandomPalette(4).then(fetchedColors => {
            colors = fetchedColors;
        });

        // mySelect.changed(() => {
        //     fetchRandomPalette().then(fetchedColors => {
        //         colors = fetchedColors;
        //     });
        // });

        
        // Création des sliders
        createSliders();
        // afficher bouton d'enregistrement
        setupExportButton();
    }



    function createSliders() {
        const container = document.getElementById("range-container");

        // Ajouter un titre global
        const title = document.createElement("h2");
        title.textContent = "Adjust the sliders :";
        container.appendChild(title);

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
        const container = document.getElementById("range-container");
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

            p.rect(x, y, rectWidth, rectHeight, 20);
            rectWidth -= 100;
            rectHeight -= 100;
            offsetY += 20;
        }
    }
}

new p5(MainSketch);






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




// congé
// layout aéré
// cycle de 10
// footer avec lien de l'api