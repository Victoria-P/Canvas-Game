import Ball from "./ball";
import Canvas from "./canvas";
import Global from "../global";
import Utils from "../utils";
import Meteor from "./meteor";
import Rectangle from "./rectangle";

class Player extends Ball {
    public meteors: Array<Meteor>;
    public rectangles: Array<Rectangle>;
    private triangles;
    private keys = {
        left: {
            action: () => this.direction += Math.PI / 180 * 3,
            active: false
        },
        right: {
            action: () => this.direction -= Math.PI / 180 * 3,
            active: false
        },
        top: {
            action: () => { if (this.speed < 10) this.speed += 0.1 },
            active: false
        },
        bottom: {
            action: () => { if (this.speed > 0) this.speed -= 0.05 },
            active: false
        }
    }
    private leftSideColor;
    private rightSideColor;

    constructor(x, y) {
        super(x, y);
        this.radius = 20;
        this.meteors = [];
        this.rectangles = [];
        this.leftSideColor = "#51c7f9";
        this.rightSideColor = "#3eaaf8";
        this.triangles = {
            left: [{x: 0, y: -20}, {x: 0, y: 15}, {x: -15, y: 20}],
            right: [{x: 0, y: -20}, {x: 0, y: 15}, {x: 15, y: 20}]
        }
        this.init();
    }
    init(){
        this.setPlayerActions();
        this.dropRectangles();
    }
    setPlayerActions() {
        $(window).keydown((e) => {
            switch (e.which) {
                case 38: this.keys.top.active = true; break;
                case 40: this.keys.bottom.active = true; break;
                case 37: this.keys.left.active = true; break;
                case 39: this.keys.right.active = true; break;
            }
        });
        $(window).keyup((e) => {
            switch (e.which) {
                case 38: this.keys.top.active = false; break;
                case 40: this.keys.bottom.active = false; break;
                case 37: this.keys.left.active = false; break;
                case 39: this.keys.right.active = false; break;
            }
        });
    }
    updateControls() {
        Object.values(this.keys).forEach(key => {
            if(key.active) key.action()
        })
    }
    draw() {
        this.drawRectangles();
        this.drawMeteors();
        Canvas.context.shadowBlur=20;
        this.drawTriangle(this.leftSideColor, this.triangles.left);
        this.drawTriangle(this.rightSideColor, this.triangles.right);
        Canvas.context.shadowColor=this.leftSideColor;
        Canvas.context.shadowBlur=0;
    }
    drawMeteors(){
        this.meteors.forEach(meteor => {
            meteor.update();
        })
    }
    drawRectangles(){
        this.rectangles.forEach((rectangle, index) => {
            rectangle.update();
            if(rectangle.alpha <= 0){
                this.rectangles.splice(index, 1);
            }
        })
    }
    drawTriangle(color, triangle){
        Canvas.context.beginPath();
        Canvas.context.fillStyle = color;
        this.rotatedTriangle(triangle).forEach((point, index) =>{
            if(index == 0){
                Canvas.context.moveTo(point.x + this.x, point.y + this.y);
            } else {
                Canvas.context.lineTo(point.x + this.x, point.y + this.y);
            }
        })
        Canvas.context.fill();
    }
    rotatedTriangle (triangle) {
        let updatedTriangle = triangle.map(point => {
            return {
                x: point.x * Math.cos(this.direction) + point.y * Math.sin(this.direction), 
                y: point.y * Math.cos(this.direction) - point.x * Math.sin(this.direction), 
            };
        })
        return updatedTriangle;
    }
    update() {
        this.updateControls();
        this.moveByDirection();
        this.updateColor();
        this.onCollision();
    }
    createMeteor() {
        let meteor = new Meteor(this);
        this.meteors.push(meteor);
    }
    createRectangle() {
        let rectangle = new Rectangle(this.x, this.y, this.direction);
        this.rectangles.push(rectangle);
    }
    dropRectangles(){
        setInterval(() => {
            this.createRectangle();
        }, 50)
    }
    checkCollision(ball) {
        let distance = Utils.getDistance(this, ball);
        if (ball != this && distance < this.radius + ball.radius + 20) {
            return true;
        }
        return false;
    }
    onCollision() {
        Global.game.balls.forEach(ball => {
            if (this.checkCollision(ball) && ball.isDead == false) {
                if (false) {
                    Global.game.killPlayer(this);
                } else {
                    this.eatBall(ball);
                    this.createMeteor();
                }
            }

        });
    }
    eatBall(ball) {
        ball.die();
    }
}
export default Player;