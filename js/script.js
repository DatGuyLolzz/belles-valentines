// Progress Tracking
const PROGRESS_KEY = 'valentine_progress';

function getProgress() {
    const saved = localStorage.getItem(PROGRESS_KEY);
    if (saved) {
        return JSON.parse(saved);
    }
    return {
        flappy: false,
        memory: false,
        snake: false,
        allComplete: false
    };
}

function saveProgress(gameId, completed) {
    const progress = getProgress();
    progress[gameId] = completed;
    progress.allComplete = progress.flappy && progress.memory && progress.snake;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

function checkAllComplete() {
    const progress = getProgress();
    return progress.allComplete;
}

// Background Elements
function createHearts() {
    const container = document.body;
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '💕';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (10 + Math.random() * 10) + 's';
        heart.style.animationDelay = Math.random() * 15 + 's';
        container.appendChild(heart);
    }
}

function createPastelCircles() {
    const container = document.body;
    const colors = ['#ffeef8', '#fff0f5', '#e6e6fa', '#f0e6ff', '#e6fff0', '#ffe0ec', '#e0f7fa', '#ffecf0'];
    const sizes = [50, 80, 120, 150, 200];

    for (let i = 0; i < 8; i++) {
        const circle = document.createElement('div');
        circle.className = 'pastel-circle';
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = sizes[Math.floor(Math.random() * sizes.length)];

        circle.style.background = color;
        circle.style.width = size + 'px';
        circle.style.height = size + 'px';
        circle.style.left = Math.random() * 100 + 'vw';
        circle.style.top = Math.random() * 100 + 'vh';
        circle.style.opacity = 0.3 + Math.random() * 0.3;
        container.appendChild(circle);
    }
}

function createConfetti() {
    const colors = ['#ff6b9d', '#ff8fab', '#ffb6c1', '#ffc0cb', '#fff0f5', '#ff69b4'];
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.width = (5 + Math.random() * 10) + 'px';
            confetti.style.height = (5 + Math.random() * 10) + 'px';
            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 5000);
        }, i * 30);
    }
}

// Memory Game Logic
const memoryEmojis = ['⭐', '🐕', '☕', '🧋', '❤️', '📷'];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;

function initMemoryGame() {
    const grid = document.getElementById('memoryGrid');
    if (!grid) return;

    grid.innerHTML = '';
    cards = [...memoryEmojis, ...memoryEmojis];
    cards.sort(() => Math.random() - 0.5);
    flippedCards = [];
    matchedPairs = 0;
    const pairsFound = document.getElementById('pairsFound');
    if (pairsFound) pairsFound.textContent = 0;
    const nextBtn = document.getElementById('memoryNext');
    if (nextBtn) nextBtn.style.display = 'none';

    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.dataset.emoji = emoji;
        const span = document.createElement('span');
        span.textContent = '?';
        card.appendChild(span);
        card.addEventListener('click', flipCard);
        grid.appendChild(card);
    });
}

function flipCard() {
    if (flippedCards.length >= 2 || this.classList.contains('flipped') || this.classList.contains('matched')) return;

    this.classList.add('flipped');
    this.querySelector('span').textContent = this.dataset.emoji;
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.emoji === card2.dataset.emoji) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        const pairsFound = document.getElementById('pairsFound');
        if (pairsFound) pairsFound.textContent = matchedPairs;
        flippedCards = [];

        if (matchedPairs === 6) {
            saveProgress('memory', true);
            setTimeout(() => {
                const nextBtn = document.getElementById('memoryNext');
                if (nextBtn) nextBtn.style.display = 'block';
                setTimeout(() => {
                    window.location.href = 'roadmap.html';
                }, 1500);
            }, 500);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.querySelector('span').textContent = '?';
            card2.querySelector('span').textContent = '?';
            flippedCards = [];
        }, 1000);
    }
}

// Flappy Bird Game Logic
let canvas, ctx;
let bird, pipes, flappyScore, flappyGameLoop, isFlappyPlaying, flappyGameOver;
let flappyGameStartTime, pipeDelay;

function initFlappyGame() {
    canvas = document.getElementById('gameCanvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    const nextBtn = document.getElementById('flappyNext');
    if (nextBtn) nextBtn.style.display = 'none';
    const scoreDisplay = document.getElementById('flappyScore');
    if (scoreDisplay) scoreDisplay.textContent = 0;

    bird = {
        x: canvas.width / 2 - 20,
        y: canvas.height / 2,
        velocity: 0,
        gravity: 0.15,
        jump: -5,
        size: 30
    };

    pipes = [];
    flappyScore = 0;
    isFlappyPlaying = true;
    flappyGameOver = false;
    flappyGameStartTime = Date.now();
    pipeDelay = 1500;

    canvas.addEventListener('click', jump);
    canvas.addEventListener('touchstart', function (e) {
        e.preventDefault();
        jump();
    }, { passive: false });

    canvas.onclick = null;

    if (flappyGameLoop) cancelAnimationFrame(flappyGameLoop);
    flappyGameLoop = requestAnimationFrame(updateFlappyGame);
}

function jump() {
    if (!isFlappyPlaying || flappyGameOver) {
        if (flappyGameOver) {
            initFlappyGame();
        }
        return;
    }
    bird.velocity = bird.jump;
}

document.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
        e.preventDefault();
        const flappyView = document.getElementById('flappy');
        if (flappyView && flappyView.classList.contains('active')) {
            jump();
        }
    }
});

function generatePipe() {
    const gap = 200;
    const minHeight = 50;
    const maxHeight = canvas.height - gap - minHeight;
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;

    pipes.push({
        x: canvas.width,
        topHeight: topHeight,
        bottomY: topHeight + gap,
        width: 60,
        scored: false
    });
}

function updateFlappyGame() {
    if (!isFlappyPlaying || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const timeSinceStart = Date.now() - flappyGameStartTime;

    drawBackground(timeSinceStart);

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.scale(-1, 1);
    ctx.font = '35px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🐤', 0, 0);
    ctx.restore();

    pipes.forEach((pipe, index) => {
        pipe.x -= 2;

        // Draw top pipe with pastel gradient
        const topGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipe.width, 0);
        topGradient.addColorStop(0, '#B8E6B8');
        topGradient.addColorStop(0.5, '#98FB98');
        topGradient.addColorStop(1, '#90EE90');
        ctx.fillStyle = topGradient;
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
        ctx.strokeStyle = '#6BCF6F';
        ctx.lineWidth = 3;
        ctx.strokeRect(pipe.x, 0, pipe.width, pipe.topHeight);

        // Draw bottom pipe with pastel gradient
        const bottomGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipe.width, 0);
        bottomGradient.addColorStop(0, '#B8E6B8');
        bottomGradient.addColorStop(0.5, '#98FB98');
        bottomGradient.addColorStop(1, '#90EE90');
        ctx.fillStyle = bottomGradient;
        ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, canvas.height - pipe.bottomY);
        ctx.strokeRect(pipe.x, pipe.bottomY, pipe.width, canvas.height - pipe.bottomY);

        if (bird.x + 25 > pipe.x && bird.x - 15 < pipe.x + pipe.width) {
            if (bird.y - 20 < pipe.topHeight || bird.y + 20 > pipe.bottomY) {
                endFlappyGame();
                return;
            }
        }

        if (pipe.x + pipe.width < bird.x && !pipe.scored) {
            pipe.scored = true;
            flappyScore++;
            const scoreDisplay = document.getElementById('flappyScore');
            if (scoreDisplay) scoreDisplay.textContent = flappyScore;

            if (flappyScore >= 2) {
                isFlappyPlaying = false;
                ctx.fillStyle = 'rgba(144, 238, 144, 0.8)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#ff6b9d';
                ctx.font = 'bold 28px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('You did it! 🎉', canvas.width / 2, canvas.height / 2 - 20);
                ctx.fillStyle = '#228B22';
                ctx.font = '20px Arial';
                ctx.fillText('Redirecting to Roadmap...', canvas.width / 2, canvas.height / 2 + 20);
                const nextBtn = document.getElementById('flappyNext');
                if (nextBtn) nextBtn.style.display = 'block';
                saveProgress('flappy', true);
                setTimeout(() => {
                    window.location.href = 'roadmap.html';
                }, 1500);
                return;
            }
        }

        if (pipe.x + pipe.width < 0) {
            pipes.splice(index, 1);
        }
    });

    if (timeSinceStart > pipeDelay && (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 250)) {
        generatePipe();
    }

    if (bird.y > canvas.height || bird.y < 0) {
        endFlappyGame();
        return;
    }

    flappyGameLoop = requestAnimationFrame(updateFlappyGame);
}

function drawBackground(time) {
    ctx.save();

    const offset = (time * 0.015) % canvas.width;

    ctx.globalAlpha = 0.5;
    ctx.font = '35px Arial';

    for (let i = 0; i < 4; i++) {
        const x = (i * 180 - offset + canvas.width) % canvas.width - 60;
        const y = 40 + (i % 2) * 80 + Math.sin(time * 0.0008 + i * 2) * 25;
        ctx.fillText('☁️', x, y);
    }

    ctx.globalAlpha = 0.7;
    ctx.font = '28px Arial';

    for (let i = 0; i < 6; i++) {
        const x = (i * 120 - offset + canvas.width) % canvas.width - 50;
        const y = 80 + (i % 2) * 70 + Math.cos(time * 0.001 + i * 1.5) * 20;
        ctx.fillText('🌸', x, y);
    }

    ctx.globalAlpha = 0.6;
    ctx.font = '24px Arial';

    for (let i = 0; i < 8; i++) {
        const x = (i * 90 - offset * 0.7 + canvas.width) % canvas.width - 45;
        const y = 120 + (i % 3) * 60 + Math.sin(time * 0.0012 + i * 3) * 18;
        ctx.fillText('🌺', x, y);
    }

    ctx.globalAlpha = 0.4;
    ctx.font = '20px Arial';

    for (let i = 0; i < 10; i++) {
        const x = (i * 75 - offset * 0.5 + canvas.width) % canvas.width - 35;
        const y = 150 + (i % 2) * 50 + Math.cos(time * 0.0006 + i * 2) * 15;
        ctx.fillText('💕', x, y);
    }

    ctx.globalAlpha = 0.35;
    ctx.font = '18px Arial';

    for (let i = 0; i < 7; i++) {
        const x = (i * 100 - offset * 0.3 + canvas.width) % canvas.width - 40;
        const y = 180 + (i % 2) * 40 + Math.sin(time * 0.0015 + i * 4) * 12;
        ctx.fillText('✨', x, y);
    }

    ctx.globalAlpha = 0.5;
    ctx.font = '22px Arial';

    for (let i = 0; i < 5; i++) {
        const x = (i * 140 - offset * 0.9 + canvas.width) % canvas.width - 55;
        const y = 60 + (i % 2) * 65 + Math.sin(time * 0.001 + i * 2.5) * 22;
        ctx.fillText('🦋', x, y);
    }

    ctx.restore();
}

function endFlappyGame() {
    flappyGameOver = true;
    isFlappyPlaying = false;
    ctx.fillStyle = 'rgba(255, 107, 157, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over! Click to retry', canvas.width / 2, canvas.height / 2);
}

// Snake Game Logic
let snakeCanvas, snakeCtx;
let snake, food, snakeScore, snakeLoop, isSnakePlaying, snakeGameOver;
let direction = 'right';
let nextDirection = 'right';
const cellSize = 45;
let gridWidth = 10;
let gridHeight = 7;

function initSnakeGame() {
    snakeCanvas = document.getElementById('snakeCanvas');
    if (!snakeCanvas) return;

    snakeCtx = snakeCanvas.getContext('2d');

    // Calculate grid dimensions based on canvas size
    gridWidth = Math.floor(snakeCanvas.width / cellSize);
    gridHeight = Math.floor(snakeCanvas.height / cellSize);

    const nextBtn = document.getElementById('snakeNext');
    if (nextBtn) nextBtn.style.display = 'none';
    const scoreDisplay = document.getElementById('snakeScore');
    if (scoreDisplay) scoreDisplay.textContent = 0;

    snake = [
        { x: 3, y: 3 },
        { x: 2, y: 3 },
        { x: 1, y: 3 }
    ];
    direction = 'right';
    nextDirection = 'right';
    snakeScore = 0;
    isSnakePlaying = true;
    snakeGameOver = false;

    generateFood();

    document.addEventListener('keydown', handleSnakeKeys);

    let touchStartX = 0;
    let touchStartY = 0;

    snakeCanvas.addEventListener('touchstart', function (e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        e.preventDefault();
    }, { passive: false });

    snakeCanvas.addEventListener('touchend', function (e) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 30 && direction !== 'left') nextDirection = 'right';
            else if (diffX < -30 && direction !== 'right') nextDirection = 'left';
        } else {
            if (diffY > 30 && direction !== 'up') nextDirection = 'down';
            else if (diffY < -30 && direction !== 'down') nextDirection = 'up';
        }
        e.preventDefault();
    }, { passive: false });

    if (snakeLoop) clearInterval(snakeLoop);
    snakeLoop = setInterval(updateSnakeGame, 180);
}

function handleSnakeKeys(e) {
    const key = e.key;
    if (key === 'ArrowUp' && direction !== 'down') nextDirection = 'up';
    else if (key === 'ArrowDown' && direction !== 'up') nextDirection = 'down';
    else if (key === 'ArrowLeft' && direction !== 'right') nextDirection = 'left';
    else if (key === 'ArrowRight' && direction !== 'left') nextDirection = 'right';
}

function updateSnakeGame() {
    if (!isSnakePlaying || !snakeCanvas) return;

    direction = nextDirection;

    const head = { x: snake[0].x, y: snake[0].y };

    if (direction === 'up') head.y--;
    else if (direction === 'down') head.y++;
    else if (direction === 'left') head.x--;
    else if (direction === 'right') head.x++;

    if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
        endSnakeGame();
        return;
    }

    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endSnakeGame();
            return;
        }
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        snakeScore++;
        const scoreDisplay = document.getElementById('snakeScore');
        if (scoreDisplay) scoreDisplay.textContent = snakeScore;
        generateFood();

        if (snakeScore >= 10) {
            isSnakePlaying = false;
            clearInterval(snakeLoop);
            snakeCtx.fillStyle = 'rgba(144, 238, 144, 0.8)';
            snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
            snakeCtx.fillStyle = '#ff6b9d';
            snakeCtx.font = 'bold 24px Arial';
            snakeCtx.textAlign = 'center';
            snakeCtx.fillText('You did it! 🎉', snakeCanvas.width / 2, snakeCanvas.height / 2 - 20);
            snakeCtx.fillStyle = '#228B22';
            snakeCtx.font = '18px Arial';
            snakeCtx.fillText('Redirecting to Roadmap...', snakeCanvas.width / 2, snakeCanvas.height / 2 + 20);
            const nextBtn = document.getElementById('snakeNext');
            if (nextBtn) nextBtn.style.display = 'block';
            saveProgress('snake', true);
            setTimeout(() => {
                window.location.href = 'roadmap.html';
            }, 1500);
            return;
        }
    } else {
        snake.pop();
    }

    drawSnake();
}

function drawSnake() {
    snakeCtx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);

    // Draw grid lines
    snakeCtx.strokeStyle = 'rgba(255, 107, 157, 0.2)';
    snakeCtx.lineWidth = 1;

    // Vertical lines
    for (let i = 0; i <= gridWidth; i++) {
        snakeCtx.beginPath();
        snakeCtx.moveTo(i * cellSize, 0);
        snakeCtx.lineTo(i * cellSize, snakeCanvas.height);
        snakeCtx.stroke();
    }

    // Horizontal lines
    for (let i = 0; i <= gridHeight; i++) {
        snakeCtx.beginPath();
        snakeCtx.moveTo(0, i * cellSize);
        snakeCtx.lineTo(snakeCanvas.width, i * cellSize);
        snakeCtx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
        const x = segment.x * cellSize;
        const y = segment.y * cellSize;

        if (index === 0) {
            // Head - Green
            snakeCtx.fillStyle = '#4CAF50';
            snakeCtx.beginPath();
            snakeCtx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 2 - 2, 0, Math.PI * 2);
            snakeCtx.fill();
            snakeCtx.strokeStyle = '#388E3C';
            snakeCtx.lineWidth = 3;
            snakeCtx.stroke();
        } else {
            // Body - alternating Green and Brown
            snakeCtx.fillStyle = index % 2 === 0 ? '#4CAF50' : '#795548';
            snakeCtx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
            snakeCtx.strokeStyle = index % 2 === 0 ? '#388E3C' : '#5D4037';
            snakeCtx.lineWidth = 2;
            snakeCtx.strokeRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
        }
    });

    // Draw food - Coffee
    const foodX = food.x * cellSize + cellSize / 2;
    const foodY = food.y * cellSize + cellSize / 2;
    snakeCtx.font = '48px Arial';
    snakeCtx.textAlign = 'center';
    snakeCtx.textBaseline = 'middle';
    snakeCtx.fillText('☕', foodX, foodY);
}

function generateFood() {
    do {
        food = {
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight)
        };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

function endSnakeGame() {
    snakeGameOver = true;
    isSnakePlaying = false;
    clearInterval(snakeLoop);
    snakeCtx.fillStyle = 'rgba(255, 107, 157, 0.8)';
    snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    snakeCtx.fillStyle = 'white';
    snakeCtx.font = 'bold 22px Arial';
    snakeCtx.textAlign = 'center';
    snakeCtx.fillText('Game Over! Click to retry', snakeCanvas.width / 2, snakeCanvas.height / 2);

    snakeCanvas.onclick = function () {
        initSnakeGame();
        snakeCanvas.onclick = null;
    };
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function () {
    createHearts();
    createPastelCircles();
});
