const panda = document.getElementById("panda");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const restartBtn = document.getElementById("restart-btn");
const startBtn = document.getElementById("start-btn");
const gameContainer = document.querySelector(".game-container");

// Sound Elements
const jumpSound = new Audio("sounds/jump.mp3");
const hitSound = new Audio("sounds/hit.mp3");
const gameOverSound = new Audio("sounds/gameover1.mp3");
const bgmusic = new Audio("sounds/bgmusic.mp3");

let isJumping = false;
let isRolling = false;
let isGameOver = false;
let jumpScore = 0;
let speed = 8;
let lives = 3;
let gameStarted = false;
let invincible = false;

// Change Panda Animation
function changePandaGif(action) {
    let gif;
    switch (action) {
        case "walk": gif = "Walk.gif"; break;
        case "jump": gif = "JumpFallLand.gif"; break;
        case "roll": gif = "Roll.gif"; break;
        case "hurt": gif = "Hit.gif"; break;
        case "death": gif = "Death.gif"; break;
        default: gif = "Idle.gif";
    }
    panda.style.backgroundImage = `url('Gifs/${gif}')`;
}

// Roll Function
function roll() {
    if (isRolling || isJumping || isGameOver) return;

    isRolling = true;
    jumpSound.currentTime = 0; 
    jumpSound.play();
    changePandaGif("roll");

    setTimeout(() => {
        isRolling = false;
        changePandaGif("walk");
    }, 500);
}

// Jump
function jump() {
    if (isJumping || isRolling || isGameOver || !gameStarted) return;

    isJumping = true;

    // ✅ Restart the jump sound
    jumpSound.currentTime = 0; 
    jumpSound.play();

    changePandaGif("jump");
    panda.classList.add("jump");

    setTimeout(() => {
        panda.classList.remove("jump");
        changePandaGif("walk");
        isJumping = false;
    }, 600);
}

// Create Obstacle
function createObstacle() {
    if (isGameOver) return;

    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");

    if (Math.random() > 0.5) {
        obstacle.classList.add("penguin-spin");
    } else {
        obstacle.classList.add("penguin-roll");
    }

    obstacle.style.right = "-80px";
    gameContainer.appendChild(obstacle);

    moveObstacle(obstacle);
}

// Move Obstacle
function moveObstacle(obstacle) {
    let passedPanda = false;

    let obstacleInterval = setInterval(() => {
        if (isGameOver) {
            clearInterval(obstacleInterval);
            return;
        }

        let obstaclePosition = parseInt(obstacle.style.right);

        if (obstaclePosition > 1080) {
            obstacle.remove();
            if (passedPanda) {
                jumpScore++;
                updateScore();
                increaseGameSpeed();
            }
            clearInterval(obstacleInterval);
        } else {
            obstacle.style.right = `${obstaclePosition + speed}px`;
        }

        if (!checkCollision(obstacle)) {
            passedPanda = true;
        }
    }, 30);
}

// Collision Detection
function checkCollision(obstacle) {
    let pandaRect = panda.getBoundingClientRect();
    let obstacleRect = obstacle.getBoundingClientRect();

    let pandaHitbox = {
        left: pandaRect.left + 45,
        right: pandaRect.right - 45,
        bottom: pandaRect.bottom - 35
    };

    let obstacleHitbox = {
        left: obstacleRect.left + 50,
        right: obstacleRect.right - 50,
        bottom: obstacleRect.bottom - 50
    };

    if (
        pandaHitbox.right > obstacleHitbox.left &&
        pandaHitbox.left < obstacleHitbox.right &&
        pandaHitbox.bottom > obstacleHitbox.bottom
    ) {
        if (!invincible) {
            loseLife();
        }
        return true;
    }

    return false;
}

// Lose Life
function loseLife() {
    if (isGameOver) return;

    lives--;
    livesDisplay.innerText = `Lives: ${lives}`; 
    invincible = true;
    hitSound.play(); // Play hit sound

    isJumping = false;
    panda.classList.remove("jump");
    changePandaGif("hurt");

    setTimeout(() => {
        if (!isGameOver) {
            changePandaGif("walk");
        }
        invincible = false;
    }, 1000);

    if (lives <= 0) {
        setTimeout(() => gameOver(), 500); // Short delay before death animation
        return;
    }
}

// Game Over
function gameOver() {
    isGameOver = true;
    changePandaGif("death");
    gameOverSound.play(); 

    document.querySelectorAll(".obstacle").forEach((obstacle) => obstacle.remove());
    restartBtn.style.display = "block";
}

// Restart Game
function restartGame() {
    isGameOver = false;
    gameStarted = true;
    jumpScore = 0;
    lives = 3;
    speed = 8;
    updateScore();
    livesDisplay.innerText = "Lives: 3";
    restartBtn.style.display = "none";
    changePandaGif("walk");

    document.querySelectorAll(".obstacle").forEach((obstacle) => obstacle.remove());

    spawnObstacles();
}

// Start Game
function startGame() {
    gameStarted = true;
    startBtn.style.display = "none";

    bgmusic.volume = 0.5; 
    bgmusic.loop = true;
    bgmusic.play();

    spawnObstacles();
}

// Spawn Obstacles
function spawnObstacles() {
    if (isGameOver) return;

    let spawnTime = Math.random() * 2500 + 3000;

    setTimeout(() => {
        if (document.querySelectorAll(".obstacle").length < 2) {
            createObstacle();
        }

        spawnObstacles();
    }, spawnTime);
}

// Increase Game Speed Based on Jump Score
function increaseGameSpeed() {
    if (jumpScore % 5 === 0 && jumpScore > 0) {
        speed += 3;

        let speedText = document.createElement("div");
        speedText.innerText = "Speed Up! 🚀";
        speedText.style.position = "absolute";
        speedText.style.top = "50%";
        speedText.style.left = "50%";
        speedText.style.transform = "translate(-50%, -50%)";
        speedText.style.fontSize = "32px";
        speedText.style.fontWeight = "bold";
        speedText.style.color = "yellow";
        speedText.style.textShadow = "2px 2px 5px black";
        gameContainer.appendChild(speedText);

        setTimeout(() => {
            speedText.remove();
        }, 1000);
    }
}

// Update Score Display
function updateScore() {
    scoreDisplay.innerText = `Score: ${jumpScore}`;
}

// User Controls
document.addEventListener("keydown", (event) => {
    if (event.code === "Space") jump();
    if (event.code === "ArrowUp") jump();
    if (event.code === "KeyW") jump();
    if (event.code === "ArrowDown") roll();
    if (event.code === "KeyS") roll();
});

// Start & Restart Buttons
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);

// Initial UI Setup
updateScore();
livesDisplay.innerText = "Lives: 3";
changePandaGif("walk");

