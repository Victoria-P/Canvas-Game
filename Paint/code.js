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
        this.colors = [
            [36, 206, 167],
            [226, 17, 142]
        ];
        this.color = "rgb(36, 206, 167)";
        this.shiftColor = Math.random();
        this.collisions = [];
        this.lines = [];
    }
    draw() {
        context.beginPath();
        context.strokeStyle = this.color;
        context.lineWidth = 3;
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.stroke();
    }
    updateColor() {
        let time = game.time;
        let color1 = this.colors[0];
        let color2 = this.colors[1];
        let color = () => {
            let c = i => Math.cos(time + this.shiftColor) * (color1[i] - color2[i]) / 2 + (color1[i] + color2[i]) / 2;
            return `rgb(${c(0)}, ${c(1)}, ${c(2)})`;
        }
        this.color = color();
    }
    move(x, y) {
        this.x = x;
        this.y = y;
    }
    moveByDirection(value = 0) {
        let step = value;
        let x = this.x + this.speed * Math.sin(this.direction);
        let y = this.y + this.speed * Math.cos(this.direction);
        if (x > window.innerWidth + this.radius) x = -this.radius;
        if (x < -this.radius) x = window.innerWidth + this.radius;
        if (y > window.innerHeight + this.radius) y = -this.radius;
        if (y < -this.radius) y = window.innerHeight + this.radius;
        this.move(x, y);
    }
    changeRadius() {
        this.radius += this.updateRadiusStep;
        if (this.radius > 30 || this.radius < 5) this.updateRadiusStep = -this.updateRadiusStep;
    }
    checkCollision(ball){
        let distance = Math.getDistance(this, ball);
            if (ball != this && distance < this.radius + ball.radius && this.collisions.indexOf(ball) == -1) {
                return true;
            } 
            return false;
    }
    update() {
        this.moveByDirection();
        this.changeRadius();
        this.updateColor();
    }
}
class Player extends Ball{
    constructor (){
        super();
    }
    checkCollision(){

    }
}

class Enemy extends Ball{
    constructor(x, y) {
        super(x, y);
    }
    onCollision() {
        game.balls.forEach(ball => {
            let distance = Math.getDistance(this, ball);
            if(this.checkCollision(ball)) {
                ball.collisions.push(this);
                ball.direction = this.direction;
                ball.moveByDirection();
                this.direction += Math.PI;
                this.moveByDirection();
            }
            if (ball != this && distance < 400 && this.lines.indexOf(ball) == -1) {
                ball.lines.push(this);
                context.beginPath();
                var grad = context.createLinearGradient(this.x, this.y, ball.x, ball.y);
                grad.addColorStop(0, `rgba(128, 0, 128, ${1 -distance / 400})`);
                grad.addColorStop(1, `rgba(255, 192, 203, ${1- distance / 400})`);
                context.strokeStyle = grad;
                context.lineWidth = 2;
                context.moveTo(this.x, this.y);
                context.lineTo(ball.x, ball.y);
                context.stroke();
            }
        });
        this.collisions = [];
        this.lines = [];
    }
    update() {
        super.update();
        this.onCollision();
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
        this.time = 0;
        // this.init();
    }
    init() {
        this.setActions();
        this.scene = new Scene();
        this.createEnemy();
        this.render();
    }
    updateTime() {
        this.time += 0.005;
    }
    setActions() {
        $("#paint").click((event) => {
            let x = event.pageX;
            let y = event.pageY;
            this.createEnemy(x, y);
        })
        $(window).resize(() => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        })
        // $("#paint").mousemove((event) => {
        //     let x = event.pageX;
        //     let y = event.pageY;
        //     this.balls.forEach(ball => {
        //         context.beginPath();
        //         context.moveTo(x, y);
        //         context.lineTo(ball.x, ball.y);
        //         context.stroke();
        //     })
        // })
    }
    createEnemy(x, y) {
        let ball = new Enemy(x, y);
        this.scene.add(ball);
        this.balls.push(ball);
    }
    moveAllBalls() {
        this.balls.forEach(ball => ball.update());
    }
    render() {
        requestAnimationFrame(this.render.bind(this)); // это то же самое, что и сет интервал
        this.updateTime();
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.moveAllBalls();
        this.scene.draw();
    }
}


var game = new Game();
game.init();

