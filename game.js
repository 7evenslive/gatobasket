const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const backgroundImage = new Image();
backgroundImage.src = 'court.jpg'; // Ruta de la imagen de fondo de la cancha

const catImg = new Image();
catImg.src = 'cat.png'; // Ruta de la imagen del gatito
const hoopImg = new Image();
hoopImg.src = 'hoop.png'; // Ruta de la imagen del aro

// Sonidos (mismos sonidos que antes)
const shootSound = new Audio('sounds/shoot.mp3');
const scoreSound = new Audio('sounds/score.mp3');
const missSound = new Audio('sounds/miss.mp3');
const loseSound = new Audio('sounds/lose.mp3');
const backgroundMusic = new Audio('sounds/background.mp3'); // Música de fondo

// Variables de juego
let catX, catY, ballX, ballY, ballSpeedY, isBallMoving, score, misses;

const catWidth = 50;
const catHeight = 50;
const hoopWidth = 50;
const hoopHeight = 50;
const ballRadius = 10;
const ballColor = '#FFA500';

// Variables para el aro
let hoopX, hoopY, hoopSpeedX;
const hoopStartX = 375;
const hoopStartY = 50;
const hoopMaxX = canvas.width - hoopWidth;
const hoopMinX = 0;
const hoopSpeed = 3;

const retryButton = document.getElementById('retryButton');

function initializeGame() {
    catX = 400;
    catY = 500;
    ballX = catX + catWidth / 2 + 50; // Mover la pelota un poco a la derecha
    ballY = catY;
    ballSpeedY = -5;
    isBallMoving = false;
    score = 0;
    misses = 0;
    hoopX = hoopStartX;
    hoopY = hoopStartY;
    hoopSpeedX = hoopSpeed;
    retryButton.style.display = 'none';

    // Iniciar música de fondo si aún no se ha iniciado
    if (backgroundMusic.paused) {
        backgroundMusic.volume = 0.5;
        backgroundMusic.play();
    }
}

document.addEventListener('keydown', moveCat);
document.addEventListener('keyup', shootBall);

function moveCat(event) {
    if (event.key === 'ArrowLeft' && catX > 0) {
        catX -= 20;
    } else if (event.key === 'ArrowRight' && catX < canvas.width - catWidth) {
        catX += 20;
    }

    if (!isBallMoving) {
        ballX = catX + catWidth / 2 + 50; // Ajustar la posición de la pelota con el gatito
    }
}

function shootBall(event) {
    if (event.key === ' ') {
        isBallMoving = true;
        shootSound.currentTime = 0;
        shootSound.play();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar imagen de fondo de la cancha
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // Dibujar el gatito
    ctx.drawImage(catImg, catX, catY, catWidth, catHeight);

    // Mover el aro
    hoopX += hoopSpeedX;
    if (hoopX > hoopMaxX || hoopX < hoopMinX) {
        hoopSpeedX = -hoopSpeedX;
    }

    // Dibujar el aro
    ctx.drawImage(hoopImg, hoopX, hoopY, hoopWidth, hoopHeight);

    if (isBallMoving) {
        ballY += ballSpeedY;
        if (ballY < 0) {
            resetBall(false);
        } else if (ballY < hoopY + hoopHeight && ballY > hoopY && ballX > hoopX && ballX < hoopX + hoopWidth) {
            resetBall(true);
            scoreSound.currentTime = 0;
            scoreSound.play();
        }
    }

    // Dibujar la pelota
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();

    // Mostrar puntos y fallos
    ctx.font = '20px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText(`Puntos: ${score}`, 10, 20);
    ctx.fillText(`Fallos: ${misses}`, 10, 50);

    if (misses < 3) {
        requestAnimationFrame(draw);
    } else {
        ctx.fillText('¡Perdiste!', canvas.width / 2 - 50, canvas.height / 2);
        retryButton.style.display = 'block';
        loseSound.play();
        backgroundMusic.pause();
    }
}

function resetBall(scored) {
    if (scored) {
        score++;
    } else {
        misses++;
        missSound.currentTime = 0;
        missSound.play();
    }

    ballX = catX + catWidth / 2 + 50; // Reiniciar posición de la pelota con el gatito
    ballY = catY;
    isBallMoving = false;
}

function restartGame() {
    initializeGame();
    draw();
}

backgroundImage.onload = () => {
    initializeGame();
    draw();
};

