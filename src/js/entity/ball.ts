import Utils from '../utils';
import Canvas from './canvas';
import Global from '../global';

class Ball {
    public x;
    public y;
    public radius;
    public updateRadiusStep;
    public direction;
    public speed;
    public colors;
    public color;
    public shiftColor;
    public collisions;
    public lines;
    
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
        Canvas.context.beginPath();
        Canvas.context.strokeStyle = this.color;
        Canvas.context.lineWidth = 3;
        Canvas.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        Canvas.context.stroke();
    }
    updateColor() {
        let time = Global.game.time;
        const color1 = this.colors[0];
        const color2 = this.colors[1];
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
        let distance = Utils.getDistance(this, ball);
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
export default Ball;