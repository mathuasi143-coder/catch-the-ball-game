const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const gameOverScreen = document.getElementById("gameOverScreen");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const player = document.getElementById("player");
const ball = document.getElementById("ball");
const gameArea = document.getElementById("gameArea");

const scoreText = document.getElementById("score");
const comboText = document.getElementById("combo");
const livesText = document.getElementById("lives");

const finalScore = document.getElementById("finalScore");
const resultScore = document.getElementById("resultScore");
const bestComboText = document.getElementById("bestCombo");

const comboPopup = document.getElementById("comboPopup");
const comboMessage = document.getElementById("comboMessage");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");


// ===============================
// GAME VARIABLES
// ===============================

let playerX = 0;
let ballX = 0;
let ballY = 0;

let score = 0;
let lives = 3;
let timeLeft = 60;
let timerInterval;
let combo = 0;
let bestCombo = 0;

let ballSpeed = 4;

let gameRunning = false;
let animationId = null;


// ===============================
// START GAME
// ===============================

startBtn.addEventListener("click", startGame);

function startGame() {

    startScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    score = 0;
    lives = 3;
    combo = 0;
    bestCombo = 0;
let timeLeft = 60;
let timerInterval;
    ballSpeed = 4;
timeLeft = 60;
document.getElementById("timer").textContent = timeLeft;

clearInterval(timerInterval);

timerInterval = setInterval(() => {

    if (!gameRunning) return;

    timeLeft--;

    document.getElementById("timer").textContent = timeLeft;

    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        endGame();
    }

}, 1000);
    scoreText.textContent = score;
    livesText.textContent = lives;
    comboText.textContent = combo;

    gameRunning = true;

    setupGame();

    cancelAnimationFrame(animationId);

    animationId = requestAnimationFrame(gameLoop);
}


// ===============================
// SETUP GAME
// ===============================

function setupGame() {

    const areaWidth = gameArea.clientWidth;
    const playerWidth = player.offsetWidth;
    const ballWidth = ball.offsetWidth;

    playerX = (areaWidth - playerWidth) / 2;

    ballX = Math.random() * (areaWidth - ballWidth);

    ballY = -ballWidth;

    player.style.left = playerX + "px";
    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";
}


// ===============================
// GAME LOOP
// ===============================

function gameLoop() {

    if (!gameRunning) {
        return;
    }

    moveBall();

    animationId = requestAnimationFrame(gameLoop);
}


// ===============================
// MOVE BALL
// ===============================

function moveBall() {

    ballY += ballSpeed;

    ball.style.top = ballY + "px";
    ball.style.left = ballX + "px";


    // Check collision
    if (checkCollision()) {

        catchBall();

        return;
    }


    // Ball missed
    if (ballY > gameArea.clientHeight) {

        missBall();
    }
}


// ===============================
// COLLISION
// ===============================

function checkCollision() {

    const ballRect = ball.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    return (
        ballRect.bottom >= playerRect.top &&
        ballRect.top <= playerRect.bottom &&
        ballRect.right >= playerRect.left &&
        ballRect.left <= playerRect.right
    );
}


// ===============================
// CATCH BALL
// ===============================

function catchBall() {

    score++;
    combo++;

    if (combo > bestCombo) {
        bestCombo = combo;
    }

    scoreText.textContent = score;
    comboText.textContent = combo;


    // Every 10 catches = +5 bonus
    if (combo % 10 === 0) {

        score += 5;

        scoreText.textContent = score;

        showComboBonus();

        // Increase difficulty
        ballSpeed += 0.5;
    }


    // Reset ball immediately
    // This prevents the ball from getting stuck
    resetBall();
}


// ===============================
// RESET BALL
// ===============================

function resetBall() {

    const ballWidth = ball.offsetWidth;

    ballY = -ballWidth;

    ballX =
        Math.random() *
        (gameArea.clientWidth - ballWidth);

    ball.style.top = ballY + "px";
    ball.style.left = ballX + "px";
}


// ===============================
// MISSED BALL
// ===============================

function missBall() {

    lives--;

    livesText.textContent = lives;

    // Reset combo when ball is missed
    combo = 0;
    comboText.textContent = combo;

    resetBall();


    if (lives <= 0) {

        endGame();
    }
}


// ===============================
// COMBO BONUS
// ===============================

function showComboBonus() {

    comboMessage.textContent =
        "🔥 " + combo + " COMBO! +5 BONUS";

    comboPopup.classList.remove("hidden");

    // Restart animation
    comboPopup.style.animation = "none";

    void comboPopup.offsetWidth;

    comboPopup.style.animation =
        "comboAnimation 0.8s ease forwards";


    setTimeout(() => {

        comboPopup.classList.add("hidden");

    }, 800);
}


// ===============================
// GAME OVER
// ===============================

function endGame() {

    gameRunning = false;

    cancelAnimationFrame(animationId);

    finalScore.textContent = score;
    resultScore.textContent = score;
    bestComboText.textContent = bestCombo;

    gameOverScreen.classList.remove("hidden");
}


// ===============================
// RESTART
// ===============================

restartBtn.addEventListener("click", function() {

    gameOverScreen.classList.add("hidden");

    startGame();
});


// ===============================
// PLAYER MOVEMENT
// ===============================

function movePlayer(direction) {

    if (!gameRunning) {
        return;
    }

    const playerWidth = player.offsetWidth;
    const areaWidth = gameArea.clientWidth;

    const moveAmount = 35;

    if (direction === "left") {

        playerX -= moveAmount;
    }

    if (direction === "right") {

        playerX += moveAmount;
    }


    // Left boundary
    if (playerX < 0) {

        playerX = 0;
    }


    // Right boundary
    if (playerX > areaWidth - playerWidth) {

        playerX = areaWidth - playerWidth;
    }

    player.style.left = playerX + "px";
}


// ===============================
// KEYBOARD CONTROLS
// ===============================

document.addEventListener("keydown", function(event) {

    if (event.key === "ArrowLeft") {

        event.preventDefault();

        movePlayer("left");
    }

    if (event.key === "ArrowRight") {

        event.preventDefault();

        movePlayer("right");
    }
});


// ===============================
// MOBILE LEFT BUTTON
// ===============================

leftBtn.addEventListener("click", function() {

    movePlayer("left");
});


// ===============================
// MOBILE RIGHT BUTTON
// ===============================

rightBtn.addEventListener("click", function() {

    movePlayer("right");
});


// ===============================
// TOUCH CONTROLS
// ===============================

leftBtn.addEventListener("touchstart", function(event) {

    event.preventDefault();

    movePlayer("left");
});


rightBtn.addEventListener("touchstart", function(event) {

    event.preventDefault();

    movePlayer("right");
});


// ===============================
// WINDOW RESIZE
// ===============================

window.addEventListener("resize", function() {

    if (!gameRunning) {
        return;
    }

    const playerWidth = player.offsetWidth;
    const areaWidth = gameArea.clientWidth;

    if (playerX > areaWidth - playerWidth) {

        playerX = areaWidth - playerWidth;

        player.style.left = playerX + "px";
    }

    const ballWidth = ball.offsetWidth;

    if (ballX > areaWidth - ballWidth) {

        ballX = areaWidth - ballWidth;

        ball.style.left = ballX + "px";
    }
});
// ===============================
// MOUSE CONTROL
// ===============================

gameArea.addEventListener("mousemove", function(event) {

    if (!gameRunning) return;

    const areaRect = gameArea.getBoundingClientRect();
    const playerWidth = player.offsetWidth;

    // Mouse position inside game area
    playerX = event.clientX - areaRect.left - (playerWidth / 2);

    // Keep player inside game area
    if (playerX < 0) {
        playerX = 0;
    }

    if (playerX > gameArea.clientWidth - playerWidth) {
        playerX = gameArea.clientWidth - playerWidth;
    }

    player.style.left = playerX + "px";
});
// ========================================
// MOBILE FINGER CONTROL
// ========================================

gameArea.addEventListener("touchmove", function(event) {

    if (!gameRunning) return;

    event.preventDefault();

    const touch = event.touches[0];
    const areaRect = gameArea.getBoundingClientRect();

    const playerWidth = player.offsetWidth;

    // Finger position
    playerX =
        touch.clientX -
        areaRect.left -
        (playerWidth / 2);

    // Keep player inside game area
    if (playerX < 0) {
        playerX = 0;
    }

    if (playerX > gameArea.clientWidth - playerWidth) {
        playerX = gameArea.clientWidth - playerWidth;
    }

    player.style.left = playerX + "px";

}, { passive: false });