const panda = document.getElementById("panda");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const restartBtn = document.getElementById("restart-btn");
const startBtn = document.getElementById("menu-start");
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
let invincible = false; // if implemented

document.getElementById("menu-start").addEventListener("click", function() {
    document.getElementById("main-menu").style.display = "none";
    startGame();
});


// Change Panda Animation
function changePandaGif(action) {
    let gif;
    switch (action) {
        case "walk": gif = "Walk.gif"; break;
        case "roll": gif = "Roll.gif"; break;
        case "hurt": gif = "Hit.gif"; break;
        case "death": gif = "Death.gif"; break;
        default: gif = "Walk.gif"; 
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

<<<<<<< HEAD
    // Reduce hitbox size while rolling
=======
    // Reduce hitbox size while rolling (optional)
>>>>>>> 394dc3c6ed20f5681616a7b7612615358dd9ad3b
    panda.style.height = "100px"; // Adjust the height for rolling animation

    setTimeout(() => {
        isRolling = false;
        changePandaGif("walk");

        // Restore hitbox size after rolling
        panda.style.height = "180px"; // Reset to normal height
    }, 500);
}


// Jump
function jump() {
    if (isJumping || isRolling || isGameOver || !gameStarted) return;

    isJumping = true;
    jumpSound.currentTime = 0; 
    jumpSound.play();

    panda.style.transition = "transform 0.3s ease-out";
    panda.style.transform = "translateY(-100px)"; // Move up

    setTimeout(() => {
        panda.style.transition = "transform 0.3s ease-in";
        panda.style.transform = "translateY(0)"; // Move down
    }, 300); // Mid-air hang time

    setTimeout(() => {
        isJumping = false;
    }, 600);
}


// Create Obstacle
function createObstacle(type) {
    if (isGameOver) return;

    const obstacle = document.createElement("div");
<<<<<<< HEAD
    obstacle.classList.add("obstacle"); // Base class

    if (type === "fly") {
        obstacle.classList.add("penguin-flap", "obstacle_fly"); // Flying obstacle
=======
    
    // Default ground obstacle class
    obstacle.classList.add("obstacle");

    let randomValue = Math.random();

    if (randomValue > 0.66) {
        obstacle.classList.add("penguin-spin");
    } else if (randomValue > 0.33) { 
        obstacle.classList.add("penguin-flap");
        obstacle.classList.add("obstacle_fly"); // Make this a flying obstacle
>>>>>>> 394dc3c6ed20f5681616a7b7612615358dd9ad3b
    } else {
        let randomGroundType = Math.random();
        if (randomGroundType > 0.5) {
            obstacle.classList.add("penguin-spin");
        } else {
            obstacle.classList.add("penguin-roll");
        }
    }

    obstacle.style.right = "-80px"; // Starts off-screen
    gameContainer.appendChild(obstacle);

    if (!isGameOver) {
        moveObstacle(obstacle);
    }
}



<<<<<<< HEAD
=======




// Move Obstacle
>>>>>>> 394dc3c6ed20f5681616a7b7612615358dd9ad3b
function moveObstacle(obstacle) {
    let passedPanda = false;

    let obstacleInterval = setInterval(() => {
        if (isGameOver) {
            clearInterval(obstacleInterval);
            return;
        }

        let obstaclePosition = parseInt(obstacle.style.right) || 0;

        // Remove obstacle when it moves off-screen
        if (obstaclePosition >= 1080) { 
            obstacle.remove();
            clearInterval(obstacleInterval);

            // Only increase score if NO collision happened
            if (passedPanda) {
                jumpScore++;
                updateScore();
                increaseGameSpeed();
            }
        } else {
            obstacle.style.right = `${obstaclePosition + speed}px`;
        }

        // Ensure "passedPanda" is only set when the obstacle is completely past the panda
        if (obstaclePosition > 150 && !passedPanda) { // Adjust "150" based on panda's position
            if (!checkCollision(obstacle)) { 
                passedPanda = true; // Only allow scoring if there was NO collision
            }
        }

        // Handle collisions (Reduce lives instead of scoring)
        if (checkCollision(obstacle)) {
            if (!invincible) {
                loseLife();
            }
            clearInterval(obstacleInterval);
            obstacle.remove(); // Remove the obstacle on collision
            passedPanda = false; // Prevent scoring if the panda hit it
        }

    }, 30);
}


// Collision Detection
function checkCollision(obstacle) {
    let pandaRect = panda.getBoundingClientRect();
    let obstacleRect = obstacle.getBoundingClientRect();

    let pandaHitbox = {
        left: pandaRect.left + 35,  
        right: pandaRect.right - 35, 
        top: pandaRect.top + 20,  // Include top to check for flying obstacles
<<<<<<< HEAD
        bottom: pandaRect.bottom - 5 
=======
        bottom: pandaRect.bottom - 25 
>>>>>>> 394dc3c6ed20f5681616a7b7612615358dd9ad3b
    };

    let obstacleHitbox = {
        left: obstacleRect.left + 80, 
        right: obstacleRect.right - 80,
<<<<<<< HEAD
        top: obstacleRect.top + 80,  // Add top boundary for flying obstacles
=======
        top: obstacleRect.top + 100,  // Add top boundary for flying obstacles
>>>>>>> 394dc3c6ed20f5681616a7b7612615358dd9ad3b
        bottom: obstacleRect.bottom - 80
    };

    // Detect collision with both ground and flying obstacles
    if (
        pandaHitbox.right > obstacleHitbox.left &&
        pandaHitbox.left < obstacleHitbox.right &&
        pandaHitbox.bottom > obstacleHitbox.top &&  // Check collision with both ground & flying obstacles
        pandaHitbox.top < obstacleHitbox.bottom
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
    hitSound.play();
    hitSound.volume = 0.5;

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
    gameOverSound.volume = 0.3;

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

    bgmusic.volume = 0.1; 
    bgmusic.loop = true;
    bgmusic.play();

    spawnObstacles();
}
// spawn obstacles depending on type
let lastObstacleType = null;
let lastSpawnTime = 0;

function spawnObstacles() {
    if (isGameOver) return;

<<<<<<< HEAD
    let spawnTime = Math.random() * 1500 + 2000; 
    let currentTime = Date.now();
    let timeSinceLastSpawn = currentTime - lastSpawnTime;

    // Prevent immediate ground spawn after flying obstacle
    if (lastObstacleType === "fly" && timeSinceLastSpawn < 1500) {
        spawnTime += 1500 - timeSinceLastSpawn;
    }
=======
    let spawnTime = Math.random() * 2500 + 3000 + 3000;
>>>>>>> 394dc3c6ed20f5681616a7b7612615358dd9ad3b

    setTimeout(() => {
        if (isGameOver) return;

        let groundObstacles = document.querySelectorAll(".obstacle:not(.obstacle_fly)");
        let flyingObstacles = document.querySelectorAll(".obstacle_fly");

        // Get last obstacle's position (if any)
        let lastObstacle = document.querySelector(".obstacle:last-child") || document.querySelector(".obstacle_fly:last-child");
        let lastObstacleRight = lastObstacle ? parseInt(lastObstacle.style.right) || 0 : 9999; // Default to far away if none

        // Enforce a minimum distance (e.g., 100px apart)
        let minGap = 150;
        if (lastObstacleRight < minGap) {
            // If too close, wait and retry
            setTimeout(spawnObstacles, 500);
            return;
        }

        // Allow only 1 flying obstacle at a time
        let canSpawnFlying = flyingObstacles.length < 1 && lastObstacleType !== "fly";
        let canSpawnGround = groundObstacles.length < 1 && lastObstacleType !== "ground";

        // Decide what to spawn based on the last obstacle type
        if (canSpawnFlying) {
            createObstacle("fly");
            lastObstacleType = "fly";
        } else if (canSpawnGround) {
            createObstacle("ground");
            lastObstacleType = "ground";
        }

        lastSpawnTime = Date.now();
        spawnObstacles();
    }, spawnTime);
}



// Increase Game Speed Based on Jump Score
function increaseGameSpeed() {
    if (jumpScore % 5 === 0 && jumpScore > 0) {
        speed += 5;

        let speedText = document.createElement("div");
        speedText.innerText = "Speed Up! 🚀";
        speedText.style.position = "absolute";
        speedText.style.top = "50%";
        speedText.style.left = "50%";
        speedText.style.transform = "translate(-50%, -50%)";
        speedText.style.fontSize = "32px";
        speedText.style.fontWeight = "bold";
        speedText.style.color = "Gold";
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