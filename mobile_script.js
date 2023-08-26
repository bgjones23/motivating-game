document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById("gameCanvas");
    canvas.width = 360;
    canvas.height = 640;
    var ctx = canvas.getContext("2d");

    var player = {
        x: canvas.width / 2,
        y: canvas.height - 65,
        size: 20,
        speed: 5,
        dx: 0,
        dy: 0
    };

    var points = 0;
    var timer = 100;
    var wave = 1;
    var highScore = localStorage.getItem('highScore') || 0;
    var obstacles = [];
    var gameOver = false;
    var gameStarted = false;
    var timerInterval;
    var waveInterval = 10; // Countdown timer for wave intervals (in seconds)
    var obstaclesIncreaseInterval = 30; // Countdown timer for obstacles increase (in seconds)
    var maxWaves = 10; // Maximum number of waves
    var obstaclesPerWave = 5; // Initial number of obstacles per wave

    var motivationalMessages = [
        "Motivate",
        "Keep after it",
        "You got this",
        "Don't stop now",
        "Believe",
        "You can do it",
        "Move faster next time",
        "Let's go",
        "Let's gooo",
        "Let's goooooo"
    ];

    function displayCopyright() {
        ctx.fillStyle = "black";
        ctx.font = "10px Futura";
        ctx.textAlign = "left";
        ctx.fillText("copyright 2023", 10, canvas.height - 10);

        ctx.textAlign = "right";
        ctx.fillText("created by Semper Ads...Always Be Advertising", canvas.width - 10, canvas.height - 10);
    }

    function startGame() {
        gameStarted = true;
        timerInterval = setInterval(function() {
            if (timer > 0) {
                timer--;
                waveInterval--;
                obstaclesIncreaseInterval--;

                if (timer % 10 === 0 && waveInterval <= 0) {
                    wave++;
                    waveInterval = 10; // Reset wave interval
                }

                if (wave % 3 === 0 && wave <= maxWaves && obstaclesIncreaseInterval <= 0) {
                    obstaclesPerWave++; // Increase obstacles per wave
                    obstaclesIncreaseInterval = 30; // Reset obstacles interval
                }
            } else {
                gameOver = true;
                clearInterval(timerInterval);
                resetGame();
            }
        }, 1000);
        update();
    }

    canvas.addEventListener('touchstart', function(event) {
        if (!gameStarted) {
            startGame();
        } else {
            // Start movement on touch
            var touchX = event.touches[0].clientX;
            if (touchX < player.x) player.dx = -player.speed;
            else if (touchX > player.x + player.size) player.dx = player.speed;
            else player.dx = 0;
        }
    });

    canvas.addEventListener('touchend', function() {
        // Stop movement on touch release
        if (!gameOver && gameStarted) {
            player.dx = 0;
        }
    });

    function spawnObstacle() {
        var size = 20;
        var x = Math.random() * (canvas.width - size);
        var y = 0;
        var type = Math.random();
        var color;
        if (type < 0.9) color = "red";
        else if (type < 0.98) color = "purple";
        else color = "gold";
        obstacles.push({x, y, size, color});
    }

    function collisionDetected(rect1, rect2) {
        return rect1.x < rect2.x + rect2.size &&
               rect1.x + rect1.size > rect2.x &&
               rect1.y < rect2.y + rect2.size &&
               rect1.y + rect1.size > rect2.y;
    }

    function updateHighScore() {
        if (points > highScore) {
            highScore = points;
            localStorage.setItem('highScore', highScore);
        }
    }

    function resetGame() {
        player.x = canvas.width / 2;
        player.y = canvas.height - 65;
        obstacles = [];
        points = 0;
        timer = 100;
        wave = 1;
        obstaclesPerWave = 5;
        gameOver = false;
        gameStarted = false;
        clearInterval(timerInterval);
        update();
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!gameStarted) {
            ctx.fillStyle = "black";
            ctx.font = "20px Futura";
            ctx.textAlign = "center";
            ctx.fillText("Press any key to start", canvas.width / 2, canvas.height / 2);
            ctx.fillText("Use arrow keys to move", canvas.width / 2, canvas.height / 2 + 30);
            return;
        }

        // Update player's position
        player.x += player.dx * player.speed;
        player.y += player
