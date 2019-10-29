import Ball from "./ball";
import Canvas from "./canvas";
import Global from "../global";
import Utils from "../utils";
import Meteor from "./meteor";

class Player extends Ball {
    public meteors: Array<Meteor>;

    constructor(x, y) {
        super(x, y);
        this.setPlayerActions();
        this.radius = 20;
        this.meteors = [];
    }
    setPlayerActions() {
        $(window).keydown((e) => {
            switch (e.which) {
                case 38: if (this.speed < 5) this.speed += 0.5; break;
                case 40: if (this.speed > 1) this.speed -= 0.5; break;
                case 37: this.direction -= Math.PI / 180 * 5; break;
                case 39: this.direction += Math.PI / 180 * 5; break;
            }
        })
    }
    draw() {
        Canvas.context.beginPath();
        Canvas.context.fillStyle = this.color;
        Canvas.context.lineWidth = 3;
        Canvas.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        Canvas.context.fill();

        this.meteors.forEach(meteor => {
            meteor.update();
        })
    }
    update() {
        this.moveByDirection();
        this.updateColor();
        this.onCollision();
    }
    createMeteor(){
        let meteor = new Meteor(this);
        this.meteors.push(meteor);
    }
    checkCollision(ball){
        let distance = Utils.getDistance(this, ball);
            if (ball != this && distance < this.radius + ball.radius) {
                return true;
            } 
            return false;
    }
    onCollision(){
        Global.game.balls.forEach(ball => {
            if(this.checkCollision(ball) && ball.isDead == false) {
                if (false){ 
                    Global.game.killPlayer(this);
                } else {
                    this.eatBall(ball);
                    this.createMeteor();
                }
            } 
            
        });
    }
    eatBall(ball){
            ball.die();
            // this.radius += 2;
    }
}
export default Player;