document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");
    
    if (!canvas || !ctx) {
        console.error("Failed to get canvas or context");
        return;
    }

    function adjustCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        player.x = canvas.width / 2;
        player.y = canvas.height / 2;
        if (gameStarted && !gameOver) {
            update();
        }
    }

    adjustCanvas();

    var player = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: 20,
        speed: 5,
        dx: 0,
        dy: 0
    };

    window.addEventListener('resize', adjustCanvas);

    var points = 0;
    var timer = 100;
    var highScore = parseInt(localStorage.getItem('highScore')) || 0;
    var obstacles = [];
    var gameOver = false;
    var gameStarted = false;
    var timerInterval;
    var messageTimeout;
    var obstacleTimeout;

    canvas.addEventListener('touchstart', function(event) {
        console.log("Touch start detected");
        if (!gameStarted) {
            startGame();
        } else {
            var touchX = event.touches[0].clientX;
            var touchY = event.touches[0].clientY;
            player.dx = (touchX < canvas.width / 2) ? -player.speed : player.speed;
            player.dy = (touchY < canvas.height / 2) ? -player.speed : player.speed;
        }
    });

    canvas.addEventListener('touchend', function(event) {
        console.log("Touch end detected");
        player.dx = 0;
        player.dy = 0;
    });

    function startGame() {
        console.log("Game started");
        gameStarted = true;
        timerInterval = setInterval(function() {
            if (timer > 0) {
                timer--;
            } else {
                endGame();
            }
        }, 1000);
        spawnObstacle();
        update();
    }

    function endGame() {
        console.log("Game ended");
        gameOver = true;
        clearInterval(timerInterval);
        showMessage();
        messageTimeout = setTimeout(resetGame, 3000);
    }

    function spawnObstacle() {
        var rand = Math.random();
        var type = rand < 0.15 ? 'red' : rand < 0.20 ? 'purple' : 'gold';
        var obstacle = {
            x: Math.random() * canvas.width,
            y: 0,
            size: 20,
            dy: 4.5,
            type: type
        };
        obstacles.push(obstacle);
        obstacleTimeout = setTimeout(spawnObstacle, 800);
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!gameStarted) {
            ctx.fillStyle = "black";
            ctx.font = "20px Futura";
            ctx.textAlign = "center";
            ctx.fillText("Touch to start", canvas.width / 2, canvas.height / 2);
            ctx.fillText("Swipe to move", canvas.width / 2, canvas.height / 2 + 30);
        } else if (!gameOver) {
            movePlayer();
            drawPlayer();
            updateObstacles();
            drawObstacles();
            checkCollisions();
            displayGameInfo();
        }
        requestAnimationFrame(update);
    }

    function resetGame() {
        console.log("Game reset");
        points = 0;
        timer = 100;
        obstacles = [];
        gameStarted = false;
        gameOver = false;
        clearInterval(timerInterval);
        clearTimeout(obstacleTimeout);
    }
});
