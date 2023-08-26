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
    var difficultyIncreaseInterval = 30; // Countdown timer for difficulty increase (in seconds)
    var maxWaves = 10; // Maximum number of waves
    var speedIncreaseFactor = 1.1; // 10% faster

    var motivationalMessages = [
        "Motivate",
        "Keep after it",
        "You got this",
        "Don't stop now",
        "Believe",
        "You can do it",
        "Move faster",
        "Let's go",
        "Let's gooo",
        "Let's goooooo",
        "Almost!",
        "So close!",
        "Keep going",
        "Nation!",
        "Sweet",
        "Motivate, or else",
        "Time to go",
        "Get it",
        "Snap!",
        "Sampsonite!",
        "C'mon!",
        "Almoooooost!",
        "In a world...",
        "If not who but us?",
        "If not now, then when?",
        "Are you not entertained?!?",
        "Seriously?",
        "Dude.",
        "Duuuuuuude.",
        "dude",
        "DUDE!",
        "You do nice work.",
        "noice",
        "realllly noice",
        "woah...",
        "wooooooahh...",
        "c'mon man!",
        "are you motivated yet?",
        "pineapple"
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
                difficultyIncreaseInterval--;

                if (timer % 10 === 0 && waveInterval <= 0) {
                    wave++;
                    waveInterval = 10; // Reset wave interval
                }

                if (wave <= maxWaves && difficultyIncreaseInterval <= 0) {
                    speedIncreaseFactor += 0.1; // Increase difficulty
                    difficultyIncreaseInterval = 30; // Reset difficulty interval
                }
            } else {
                gameOver = true;
                clearInterval(timerInterval);
                resetGame();
            }
        }, 1000);
        update();
    }

    document.addEventListener("keydown", function(event) {
        if (!gameStarted) {
            startGame();
        } else {
            // Set the direction for immediate movement
            if (event.key === "ArrowRight") player.dx = player.speed;
            if (event.key === "ArrowLeft") player.dx = -player.speed;
            if (event.key === "ArrowUp") player.dy = -player.speed;
            if (event.key === "ArrowDown") player.dy = player.speed;
        }
    });

    document.addEventListener("keyup", function(event) {
        // Stop movement on key release
        if (!gameOver && gameStarted) {
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") player.dx = 0;
            if (event.key === "ArrowUp" || event.key === "ArrowDown") player.dy = 0;
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
        speedIncreaseFactor = 1.1;
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
        player.x += player.dx * speedIncreaseFactor;
        player.y += player.dy * speedIncreaseFactor;

        // Keep player within bounds
        if (player.x < 0) player.x = 0;
        if (player.x + player.size > canvas.width) player.x = canvas.width - player.size;
        if (player.y < 0) player.y = 0;
        if (player.y + player.size > canvas.height) player.y = canvas.height - player.size;

        // Draw player
        ctx.fillStyle = "blue";
        ctx.fillRect(player.x, player.y, player.size, player.size);

        // Draw obstacles and check for collisions
        for (var i = 0; i < obstacles.length; i++) {
            var obs = obstacles[i];
            obs.y += 5;
            ctx.fillStyle = obs.color;
            ctx.fillRect(obs.x, obs.y, obs.size, obs.size);

            // Collision check
            if (collisionDetected(player, obs)) {
                if (obs.color === "red") {
                    gameOver = true;
                    clearInterval(timerInterval);

                    // Display a random motivational message
                    var randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
                    ctx.fillStyle = "black";
                    ctx.font = "40px Futura";
                    ctx.textAlign = "center";
                    ctx.fillText(randomMessage, canvas.width / 2, canvas.height / 2);

                    updateHighScore(); // Update high score before resetting
                    setTimeout(resetGame, 2000);
                    return;

                } else if (obs.color === "gold") {
                    points += 10;
                    obstacles.splice(i, 1);
                    i--;

                } else if (obs.color === "purple") {
                    timer += 5;
                    obstacles.splice(i, 1);
                    i--;
                }
            }
        }

        // Display points and timer
        ctx.fillStyle = "black";
        ctx.font = "18px Futura";
        ctx.textAlign = "right";
        ctx.fillText(`Points: ${points}`, canvas.width - 10, 25);
        ctx.fillText(`Time: ${timer}s`, canvas.width - 10, 50);
        ctx.fillText(`High Score: ${highScore}`, canvas.width - 10, 75); // Display high score
        ctx.fillText(`Wave: ${wave}`, canvas.width - 10, 100); // Display wave

        // Spawn new obstacles
        if (Math.random() < 0.05) spawnObstacle();

        // Display copyright text
        displayCopyright();

        if (!gameOver) {
            requestAnimationFrame(update);
        }
    }

    // Start the game loop
    update();
});
