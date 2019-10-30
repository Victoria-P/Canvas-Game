import Ball from "./ball";
import Global from "../global";
import Utils from "../utils";
import Canvas from "./canvas";

class Bubbles extends Ball {
    private collisions;
    private lines;

    constructor(x = 0, y = 0) {
        super(x, y);
        this.radius = 1;
        this.colors = [
            [128, 48, 231, 0],
            [17, 3, 36, 0]
        ];
        this.collisions = [];
        this.lines = [];
        this.speed = 0.5;
    }
    updateColor() {
        let time = Global.game.time;
        const color1 = this.colors[0];
        const color2 = this.colors[1];
        let color = () => {
            let c = i => Math.cos(time + this.shiftColor) * (color1[i] - color2[i]) / 2 + (color1[i] + color2[i]) / 2;
            return `rgb(${c(0)}, ${c(1)}, ${c(2)}, ${c(3)})`;
        }
        this.color = color();
    }
    checkCollision(bubble) {
        let distance = Utils.getDistance(this, bubble);
        if (bubble != this && distance < this.radius + bubble.radius && this.collisions.indexOf(bubble) == -1) {
            return true;
        }
        return false;
    }
    onCollision() {
        Global.game.bubbles.forEach(bubble => {
            if (this.checkCollision(bubble)) {
                bubble.collisions.push(this);
                bubble.direction = this.direction;
                bubble.moveByDirection();
                this.direction += Math.PI;
                this.moveByDirection();
            }
            let distance = Utils.getDistance(this, bubble);
            if (bubble != this && distance < 20 && this.lines.indexOf(bubble) == -1) {
                bubble.lines.push(this);
                Canvas.context.beginPath();
                var grad = Canvas.context.createLinearGradient(this.x, this.y, bubble.x, bubble.y);
                grad.addColorStop(0, `rgba(128, 0, 128, ${1 - distance / 20})`);
                grad.addColorStop(1, `rgba(255, 192, 203, ${1 - distance / 20})`);
                Canvas.context.strokeStyle = grad;
                Canvas.context.lineWidth = 2;
                Canvas.context.moveTo(this.x, this.y);
                Canvas.context.lineTo(bubble.x, bubble.y);
                Canvas.context.stroke();
            }
        });
    }
    update() {
        this.moveByDirection();
        this.updateColor();
        this.onCollision();
    }
}

export default Bubbles;