const playBoard = document.querySelector('.play-board');
const scoreElement = document.querySelector('.score');
const highScoreElement = document.querySelector('.high-score');
const controls = document.querySelectorAll('.controls i');

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let intervalSpeed = 300;
let score = 0;

// Get high score from localStorage or initialize it to 0
let highScore = localStorage.getItem('high-score') || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

// Generate random food position between 1 and 30
const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert('Game Over! Press OK to Replay...');
    location.reload();
};

// Change velocity based on key press
const changeDirection = (e) => {
    if (e.key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
};

// Change direction on each key click for mobile controls
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () => {
    if (gameOver) return handleGameOver();

    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Check if snake eats the food
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); // Add food position to snake body
        score++;
        if (intervalSpeed > 50){
            intervalSpeed = intervalSpeed - 50;
        }
        highScore = score > highScore ? score : highScore;
        localStorage.setItem('high-score', highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    // Update snake position based on velocity
    snakeX += velocityX;
    snakeY += velocityY;

    // Shift body parts
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY];

    // Check if snake hits wall
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
        return;
    }

    // Render snake body parts
    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

        // Check if snake head hits the body
        if (i !== 0 && snakeBody[0][0] === snakeBody[i][0] && snakeBody[0][1] === snakeBody[i][1]) {
            gameOver = true;
        }
    }

    playBoard.innerHTML = html;
};

updateFoodPosition();
setIntervalId = setInterval(initGame, intervalSpeed);
document.addEventListener('keydown', changeDirection);
