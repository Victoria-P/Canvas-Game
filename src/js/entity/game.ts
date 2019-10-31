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
    private isOver: boolean = false;
    private gameOverUI;

    constructor() {
        this.gameOverUI = $("#gameover-popup");
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
        $("#restart").click((event) => {
            this.restart();
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
        this.isOver = true;
        // this.gameOverUI.show();
    }

    restart(){
        this.bubbles = [];
        this.balls = [];
        this.players = [];
        this.time = 0;
        this.scene = new Scene();
        this.addBubbles();
        this.createPlayer(window.innerWidth / 2, window.innerHeight / 2);
        this.generateEnemies();
        this.isOver = false;
        // this.gameOverUI.hide();
    }
    generateEnemies(){
        setInterval(() => {
            if(this.balls.length == 20) return;
            let x = Math.random() * window.innerWidth;
            let y = Math.random() * window.innerHeight;
            this.createEnemy(x, y);
        }, 2000)
    }
    render() {
        requestAnimationFrame(this.render.bind(this));
        this.updateTime();
        Canvas.context.globalAlpha=0.5;
        Canvas.context.fillStyle = "#000000";
        Canvas.context.fillRect(0, 0, window.innerWidth, window.innerHeight);
        this.moveAllBalls();
        this.moveAllPlayers();
        this.moveAllBubbles();
        this.scene.draw();
    }
}
export default Game;