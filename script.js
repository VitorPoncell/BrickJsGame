var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var x = generateX();
var y = generateY();
var speed = 4;
var dx;
var dy;
var ballRadius = 10;
var paddleHeigth = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeigth = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;
var level = 1;
var maxLevel = 5;
var paused = false;

var bricks = [];
initBricks();
//inicia os blocos
function initBricks(){
    for (c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 }
        }
    }
}

//link eventos a suas funcoes
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

//desenha blocos
function drawBricks() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeigth + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeigth);
                ctx.fillStyle = "#0095DD"
                ctx.fill();
                ctx.closePath();
            }

        }
    }
}

generetaDxAndDy();
generateX();
generateY();
function generateX(){
    x = (canvas.width / 2) + Math.floor(Math.random()*21)-10;
}

function generateY(){
    y = (canvas.height - 30) + Math.floor(Math.random()*21)-10;
}

function generetaDxAndDy(){
    dx = (Math.random()*speed*8/10) -speed*40/100;
    dy = -(speed - dx);
}

//verifica se tecla for presionada
function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    }
    else if (e.keyCode == 37) {
        leftPressed = true;
    }
}

//verifica se tecla foi solta
function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    }
    else if (e.keyCode == 37) {
        leftPressed = false;
    }
}


//rededsenha bola
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

//redesenha paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeigth, paddleWidth, paddleHeigth);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function brickCollisionDetection() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (bricks[c][r].status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeigth) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score == brickRowCount*brickColumnCount) {
                        if(level == maxLevel){
                            alert("YOU WIN!");
                            document.location.reload();
                        }else{
                            level++;
                            brickRowCount++;
                            initBricks();
                            score = 0;
                            generetaDxAndDy();
                            generateX();
                            generateY();
                            paddleX = (canvas.width-paddleWidth)/2;
                            pause();
                        }

                    }
                }
            }
        }
    }
}

function pause(){
    paused = true;
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FFFFFF"
    ctx.fillText("Level " + (level - 1) + " completed, starting next level...", 110, 150);
    setTimeout(function(){
        paused = false;
        draw();
    }, 3000);
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD"
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD"
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawLevel(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD"
    ctx.fillText("Level: " + level, 210, 20);
}

function draw() {
    //limpa tela
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();
    drawLives();
    drawLevel();
    brickCollisionDetection();


    //verifica colisao em cima e em baixo ou no paddle
    if (y + dy - ballRadius < 0) {
        dy = -dy;
    } else if (y + dy + ballRadius > canvas.height) {
        //se bate no paddle cica se n game over
        if (x > paddleX && x < paddleX + paddleWidth) {
            generetaDxAndDy();
        } else {
            lives--;
            if (!lives) {
                alert("GAME OVER\nScore: " + score);
                document.location.reload();
            }else{
                generateX();
                generateY();
                paddleX = (canvas.width-paddleWidth)/2;
            }

        }

    }
    //verifica colisao dos lados esquerdo e direito
    if (x + dx - ballRadius < 0 || x + dx + ballRadius > canvas.width) {
        dx = -dx;
    }

    //move para direita e esquerda
    if (rightPressed && paddleX - canvas.width + paddleWidth < 0) {
        paddleX += 7;
    }
    else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
    if(!paused){
        requestAnimationFrame(draw);
    }
}

document.addEventListener("mousemove", mouseMoveHandler);

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 + paddleWidth / 2 && relativeX < canvas.width - paddleWidth / 2) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

draw();