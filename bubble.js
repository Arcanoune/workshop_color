let bubbles = [];

function setup() {
    const canvasParent = document.getElementById('bubble-container');
    canvasParent.style.display = "block"; 
    const canvas = createCanvas(window.innerWidth, window.innerHeight);
    canvas.parent(canvasParent);
    noStroke();

    for (let i = 0; i < 20; i++) {
        let x = random(width);
        let y = random(height);
        let radius = random(20, 60);
        let color = random(colors);
        let speedX = random(-1, 1);
        let speedY = random(-1, 1);
        bubbles.push(new Bubble(x, y, radius, color, speedX, speedY));
    }
}


function draw() {
    background(30);
    for (let bubble of bubbles) {
        bubble.move();
        bubble.display();
    }
}

class Bubble {
    constructor(x, y, radius, color, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x - this.radius < 0 || this.x + this.radius > width) this.speedX *= -1;
        if (this.y - this.radius < 0 || this.y + this.radius > height) this.speedY *= -1;
    }

    display() {
        // Vérification simple si la couleur est valide (hexadecimal)
        if (/^#[0-9A-F]{6}$/i.test(this.color)) {
            fill(this.color);
        } else {
            fill("#FFFFFF");  // Blanc par défaut si la couleur est invalide
        }
        ellipse(this.x, this.y, this.radius * 2);
    }
}


function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}
