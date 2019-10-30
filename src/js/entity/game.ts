import Enemy from "./enemy";
import Canvas from "./canvas";
import Scene from "./scene";
import Player from "./player";
import Ball from "./ball";
import Bubbles from "./bubbles";
import Global from "../global";

class Game {
    public bubbles: Array<Bubbles>;
    public balls: Array<Enemy>;
    public players: Array<Player>;
    public time: number;
    public scene: Scene;

    constructor() {
    }
    init() {
        Canvas.updateSize();
        this.setActions();
        this.restart();
        this.render();
    }
    updateTime() {
        this.time += 0.005;
    }
    setActions() {
        $("#scene").click((event) => {
            let x = event.pageX;
            let y = event.pageY;
            this.createEnemy(x, y);
        });
        
        $(window).resize(() => {
            Canvas.updateSize();
        })
    }
    addBubbles(x = 0, y = 0){
        for(let i = 0; i < 100; i+=1){
            let x = Math.random()*window.innerWidth;
            let y = Math.random()*window.innerHeight;
            let bubble = new Bubbles(x, y);
            this.scene.add(bubble);
            this.bubbles.push(bubble);
        }
    }
    createEnemy(x = 0, y = 0) {
        let ball = new Enemy(x, y);
        this.scene.add(ball);
        this.balls.push(ball);
    }
    createPlayer(x = 0, y = 0) {
        let player = new Player(x, y);
        this.scene.add(player);
        this.players.push(player);
    }
    moveAllBubbles(){
        this.bubbles.forEach(bubble => bubble.update());
    }
    moveAllBalls() {
        this.balls.forEach(ball => ball.update());
    }
    moveAllPlayers() {
        this.players.forEach(player => player.update());
    }
    killPlayer(player: Player){
        this.scene.remove(player);
        let index = this.players.indexOf(player);
        this.players.splice(index, 1);
        this.restart();
    }
    restart(){
        this.bubbles = [];
        this.balls = [];
        this.players = [];
        this.time = 0;
        this.scene = new Scene();
        this.addBubbles();
        this.createPlayer();

    }
    render() {
        requestAnimationFrame(this.render.bind(this));
        this.updateTime();
        Canvas.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.moveAllBalls();
        this.moveAllPlayers();
        this.moveAllBubbles();
        this.scene.draw();
    }
}
export default Game;