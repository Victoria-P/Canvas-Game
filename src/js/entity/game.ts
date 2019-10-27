import Enemy from "./enemy";
import Canvas from "./canvas";
import Scene from "./scene";

class Game {
    public balls: Array<Enemy>;
    public time: number;
    private scene: Scene;
    constructor() {
        this.balls = [];
        this.time = 0;
    }
    init() {
        Canvas.updateSize();
        this.setActions();
        this.scene = new Scene();
        this.createEnemy();
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
        })
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
    moveAllBalls() {
        this.balls.forEach(ball => ball.update());
    }
    render() {
        requestAnimationFrame(this.render.bind(this)); // это то же самое, что и сет интервал
        this.updateTime();
        Canvas.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.moveAllBalls();
        this.scene.draw();
    }
}
export default Game;