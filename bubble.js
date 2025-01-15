let bubbles = []; // Tableau pour stocker les bulles

function BubbleSketch(p) {
    p.setup = function setup() {
        p.createCanvas(window.innerWidth, window.innerHeight, document.getElementById('bubble-canvas'));
        p.noStroke();

        const interval = setInterval(() => {
            if (colors.length > 0) {
                clearInterval(interval);
                for (let i = 0; i < 50; i++) {
                    let x = p.random(p.width);
                    let y = p.random(p.height);
                    let radius = 250; // Taille des bulles
                    let color = p.random(colors);

                    let angle = p.random(p.TWO_PI); // Angle de direction aléatoire
                    let speed = 1; // Vitesse constante
                    let speedX = speed * Math.cos(angle);
                    let speedY = speed * Math.sin(angle);

                    bubbles.push(new Bubble(x, y, radius, color, speedX, speedY));
                }
            }
        }, 100);
    };

    p.draw = function draw() {
        p.background(255);

        for (let bubble of bubbles) {
            bubble.move();
            bubble.display();
        }
    };

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

            // Rebondissement sur les bords
            if (this.x - this.radius < 0 || this.x + this.radius > p.width) this.speedX *= -1;
            if (this.y - this.radius < 0 || this.y + this.radius > p.height) this.speedY *= -1;
        }

        display() {
            p.fill(this.color || "#FFFFFF");
            p.drawingContext.shadowBlur = 20; // Intensité du flou
            p.drawingContext.shadowColor = p.color(this.color || "#FFFFFF"); // Couleur de l'ombre
            p.ellipse(this.x, this.y, this.radius * 2);
        }
    }
}

new p5(BubbleSketch);


function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}
