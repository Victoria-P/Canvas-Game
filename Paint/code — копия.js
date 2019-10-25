let canvas = document.getElementById("paint");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let lastClick;

let mouseBall = {
    x: 0,
    y: 0
};

let balls = []
// function createBall(x, y) {
//     let ball = { x, y };
//     return ball;
// }
function addBall(ball) {
    balls.push(ball);
}
function dropBalls() {
    balls.forEach(ball => {
        ball.y++;
        if (ball.y > window.innerHeight) { ball.y = -10 }
    });
}
function drawBalls() {
    balls.forEach((ball, index) => {
        ball.draw();
    })
}
function render() {
        requestAnimationFrame(render);
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        dropBalls();
        drawBalls();
        drawMouseBall();
}
render(); 
// это то же самое, что и сет интервал

$("#paint").click(function (event) {
    let x = event.pageX;
    let y = event.pageY;
    let ball = new Ball(x, y);
    addBall(ball);
})



function drawMouseBall() {
    ctx.beginPath();
    ctx.fillStyle = "#efef3c";
    ctx.arc(mouseBall.x, mouseBall.y, 10, 0, 2 * Math.PI);
    ctx.fill();
    balls.forEach(ball => {
        ctx.beginPath();
            ctx.moveTo(mouseBall.x, mouseBall.y);
            ctx.lineTo(ball.x, ball.y);
            ctx.stroke();
    })
}

$("#paint").mousemove(function (event) {
    let x = event.pageX;
    let y = event.pageY;
    mouseBall.x = x;
    mouseBall.y = y;
})
 

