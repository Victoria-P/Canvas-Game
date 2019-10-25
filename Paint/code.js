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
    setShadow(context, color, ox, oy, blur) {
        context.shadowColor = color;
        context.shadowOffsetX = ox;
        context.shadowOffsetY = oy;
        context.shadowBlur = blur;
    }
    draw() {
        context.beginPath();
        context.strokeStyle = "rgba(0, 217, 255, 0.898)";
        context.lineWidth = 3;
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.setShadow(context, "white", 0, 0, 10);
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
        this.fishes = [];
        this.init();
    }
    init() {
        this.setActions();
        this.scene = new Scene();
        this.createBall();
        this.createFishes();
        this.render();
    }
    setActions() {
        $("#paint").click((event) => {
            let x = event.pageX;
            let y = event.pageY;
            this.createBall(x, y);
            this.createFish(x, y);
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
    createFish(x, y, direction) {
        let fish = new Fish(x, y, direction);
        this.scene.add(fish);
        this.fishes.push(fish);
    }
    createFishes(){
        for(let i = 0; i < 20; i++) {
            let x = Math.random()*window.innerWidth;
            let y = Math.random()*window.innerHeight;
            let direction = Math.random() > 0.5 ? 1 : -1;
            this.createFish(x, y, direction);
            }
    }
    moveAllBalls() {
        this.balls.forEach(ball => ball.update());
    }
    moveAllFishes() {
        this.fishes.forEach(fish => fish.moveByDirection());
    }
    render() {
        requestAnimationFrame(this.render.bind(this)); // это то же самое, что и сет интервал
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.moveAllBalls();
        this.moveAllFishes();
        this.scene.draw();
    }
}

class Fish {
    constructor(x = 0, y = 0, direction = 1) {
        this.x = x;
        this.y = y;
        this.speed = 3;
        this.direction = direction;
        this.textures = document.getElementsByClassName("texture");
        this.currentTexture = direction == 1 ? 0 : 1;
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
        this.move(x, this.y)
    }

}

let game = new Game();