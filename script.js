const panda = document.getElementById("panda");
const scoreDisplay = document.getElementById("score");
const restartBtn = document.getElementById("restart-btn");
const gameContainer = document.querySelector(".game-container");

let isJumping = false;
let isRolling = false;
let isGameOver = false;
let score = 0;
let speed = 8;

// Switch Panda Animation GIFs
function changePandaGif(action) {
    let gif;
    switch (action) {
        case "walk": gif = "Walk.gif"; break;
        case "jump": gif = "JumpFallLand.gif"; break;
        case "roll": gif = "Roll.gif"; break;
        case "hit": gif = "Hit.gif"; break;
        case "death": gif = "Death.gif"; break;
        default: gif = "Walk.gif"; // Default 
    }
    panda.style.backgroundImage = `url('Gifs/${gif}')`;
}

// Jump Function
function jump() {
    if (isJumping || isRolling || isGameOver) return;
    
    isJumping = true;
    changePandaGif("jump");
    panda.classList.add("jump");

    setTimeout(() => {
        panda.classList.remove("jump");
        isJumping = false;
        changePandaGif("walk");
    }, 600);
}

// Roll Function
function roll() {
    if (isRolling || isJumping || isGameOver) return;

    isRolling = true;
    changePandaGif("roll");

    setTimeout(() => {
        isRolling = false;
        changePandaGif("walk");
    }, 500);
}

// Create a New Obstacle (Penguin)
function createObstacle() {
    if (isGameOver) return;

    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");

    // 50% chance of spin or roll
    if (Math.random() > 0.5) {
        obstacle.classList.add("penguin-spin");
    } else {
        obstacle.classList.add("penguin-roll");
    }

    obstacle.style.right = "-80px"; // Start off-screen
    gameContainer.appendChild(obstacle);

    moveObstacle(obstacle);
}

// Move Obstacle
function moveObstacle(obstacle) {
    let obstacleInterval = setInterval(() => {
        if (isGameOver) {
            clearInterval(obstacleInterval);
            return;
        }

        let obstaclePosition = parseInt(obstacle.style.right);
        if (obstaclePosition > 1080) {
            obstacle.remove();
        } else {
            obstacle.style.right = `${obstaclePosition + speed}px`;
        }

        checkCollision();
    }, 30);
}

// Check Collision
function checkCollision() {
    let pandaRect = panda.getBoundingClientRect();
    let obstacles = document.querySelectorAll(".obstacle");

    obstacles.forEach((obstacle) => {
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

        // Collision Check
        if (
            pandaHitbox.right > obstacleHitbox.left &&
            pandaHitbox.left < obstacleHitbox.right &&
            pandaHitbox.bottom > obstacleHitbox.bottom
        ) {
            gameOver();
        }
    });
}

// Game Over Function
function gameOver() {
    isGameOver = true;
    changePandaGif("hit");

    setTimeout(() => {
        changePandaGif("death");
    }, 800);

    document.querySelectorAll(".obstacle").forEach((obstacle) => obstacle.remove());

    restartBtn.style.display = "block";
}

// Restart Game Function
function restartGame() {
    isGameOver = false;
    score = 0;
    speed = 8; // Reset speed
    scoreDisplay.innerText = "Score: 0";
    restartBtn.style.display = "none";
    changePandaGif("walk");

    document.querySelectorAll(".obstacle").forEach((obstacle) => obstacle.remove());

    spawnObstacles();
}

// Function to Start Spawning Obstacles
function spawnObstacles() {
    if (!isGameOver) {
        let spawnTime = Math.random() * 2000 + 2000; // Random 2-4 seconds

      
        if (score > 100) spawnTime *= 0.9;  // 10% faster after 100 points
        if (score > 200) spawnTime *= 0.8;  // 20% faster after 200 points
        if (score > 300) spawnTime *= 0.7;  // 30% faster after 300 points

        setTimeout(() => {
            createObstacle();
            spawnObstacles();
        }, spawnTime);
    }
}
// Score Increment & Increase Speed Over Time
setInterval(() => {
    if (!isGameOver) {
        score++;
        scoreDisplay.innerText = `Score: ${score}`;

        // Increase speed every 100 points
        if (score % 100 === 0) {
            speed += 2;
        }
    }
}, 100);

// Listen for Key Presses
document.addEventListener("keydown", (event) => {
    if (event.code === "Space") jump();
    if (event.code === "ArrowUp") jump();
    if (event.code === "ArrowDown") roll();
});

// Listen for Mouse Click (Left Click = Jump)
document.addEventListener("click", () => {
    jump();
});


// Start Spawning Obstacles When Game Loads
spawnObstacles();
changePandaGif("walk");
