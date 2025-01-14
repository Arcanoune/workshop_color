let colors = ["yellow", "blue", "red", "orange"];

function setup() {
    createCanvas(600, 600);
    noLoop();
}

function draw() {
    let sets = 4;
    let rectWidth = 600;
    let rectHeight = 600;
    let offsetY = 20; 


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

}
