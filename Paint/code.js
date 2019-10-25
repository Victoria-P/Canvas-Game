let canvas = document.getElementById("paint");
let context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Ball {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.radius = 15;
        this.updateRadiusStep = 0.5;
        this.direction = Math.random() * Math.PI * 2;
        this.speed = 3;
    }
    draw() {
        context.beginPath();
        context.strokeStyle = "#efef3c";
        context.lineWidth = 3;
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.stroke();
    }
    move(x, y) {
        this.x = x;
        this.y = y;
    }
    moveByDirection() {
        let x = this.x + this.speed * Math.sin(this.direction);
        let y = this.y + this.speed * Math.cos(this.direction);
        if (x > window.innerWidth + this.radius) x = -this.radius;
        if (x < -this.radius) x = window.innerWidth + this.radius;
        if (y > window.innerHeight + this.radius) y = -this.radius;
        if (y < -this.radius) y = window.innerHeight + this.radius;
        this.move(x, y);
    }
    drop() {
        this.move(this.x, this.y + 1)
        if (this.y > window.innerHeight) { this.move(this.x, -10) };
    }
    changeRadius() {
        this.radius += this.updateRadiusStep;
        if (this.radius > 30 || this.radius < 5) this.updateRadiusStep = -this.updateRadiusStep;
    }
    update() {
        this.moveByDirection();
        this.changeRadius();
    }
}

class Scene {
    constructor() {
        this.children = [];
    }
    draw() {
        this.children.forEach(child => child.draw());
    }
    add(child) {
        this.children.push(child);
    }
}


class Game {
    constructor() {
        this.balls = [];
        this.boxes = [];
        this.init();
    }
    init() {
        this.setActions();
        this.scene = new Scene();
        this.render();
    }
    setActions() {
        $("#paint").click((event) => {
            let x = event.pageX;
            let y = event.pageY;
            this.createBall(x, y);
            this.createBox(x, y);
        })
        $(window).resize(() => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        })
    }
    createBall(x, y) {
        let ball = new Ball(x, y);
        this.scene.add(ball);
        this.balls.push(ball);
    }
    createBox(x, y, direction) {
        let box = new Box(x, y, direction);
        this.scene.add(box);
        this.boxes.push(box);
    }
    moveAllBalls() {
        this.balls.forEach(ball => ball.update());
    }
    moveAllBoxes() {
        this.boxes.forEach(box => box.moveByDirection());
    }
    render() {
        requestAnimationFrame(this.render.bind(this)); // это то же самое, что и сет интервал
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.moveAllBalls();
        this.moveAllBoxes();
        this.scene.draw();
    }
}

class Box {
    constructor(x = 0, y = 0, direction = 1) {
        this.x = x;
        this.y = y;
        this.speed = 3;
        this.direction = direction;
        this.textures = document.getElementsByClassName("texture");
        this.currentTexture = 0;
    }
    draw() {
        context.beginPath();
        // context.fillStyle = "#efef3c";
        // context.rect(this.x, this.y, 15, 15);
        // context.fill();
        context.drawImage(this.textures[this.currentTexture], this.x, this.y);

        
    }
    move(x, y) {
        this.x = x;
        this.y = y;
    }
    moveByDirection() {
        let x = this.x + this.speed * this.direction;
        if (x > window.innerWidth + 3) { 
            this.direction = -this.direction; 
            this.currentTexture = 1;
        }
        if (x < 0) { 
            this.direction = -this.direction;
            this.currentTexture = 0;
        }
        this.move(x, this.y);
        console.log("heeeeey");
    }

}

let game = new Game();