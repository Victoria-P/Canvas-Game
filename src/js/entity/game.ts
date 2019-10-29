import Enemy from "./enemy";
import Canvas from "./canvas";
import Scene from "./scene";
import Player from "./player";

class Game {
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
        this.balls = [];
        this.players = [];
        this.time = 0;
        this.scene = new Scene();
        this.createPlayer();
    }
    render() {
        requestAnimationFrame(this.render.bind(this));
        this.updateTime();
        Canvas.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.moveAllBalls();
        this.moveAllPlayers();
        this.scene.draw();
    }
}
export default Game;