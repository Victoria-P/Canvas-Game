import Ball from "./ball";
import Utils from "../utils";
import Canvas from "./canvas";
import Global from "../global";
class Enemy extends Ball{
    constructor(x, y) {
        super(x, y);
    }
    onCollision() {
        Global.game.balls.forEach(ball => {
            if(this.checkCollision(ball)) {
                ball.collisions.push(this);
                ball.direction = this.direction;
                ball.moveByDirection();
                this.direction += Math.PI;
                this.moveByDirection();
            }
            let distance = Utils.getDistance(this, ball);
            if (ball != this && distance < 400 && this.lines.indexOf(ball) == -1) {
                ball.lines.push(this);
                Canvas.context.beginPath();
                var grad = Canvas.context.createLinearGradient(this.x, this.y, ball.x, ball.y);
                grad.addColorStop(0, `rgba(128, 0, 128, ${1 -distance / 400})`);
                grad.addColorStop(1, `rgba(255, 192, 203, ${1- distance / 400})`);
                Canvas.context.strokeStyle = grad;
                Canvas.context.lineWidth = 2;
                Canvas.context.moveTo(this.x, this.y);
                Canvas.context.lineTo(ball.x, ball.y);
                Canvas.context.stroke();
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
export default Enemy;