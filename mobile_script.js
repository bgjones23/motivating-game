document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById("gameCanvas");
    canvas.width = window.innerWidth - 10;
    canvas.height = window.innerHeight - 20;
    var ctx = canvas.getContext("2d");

    var player = {
        x: canvas.width / 2,
        y: canvas.height - 25,
        size: 20,
        speed: 5,
        dx: 0,
        dy: 0
    };

    var obstacles = [];
    var gameOver = false;
    var gameStarted = false;

    var moveDirection = null;

    var timer = 100;
    var gameClock = 0;
    var waveCountdown = 10;
    var waveNumber = 1;
    var obstacleSpeed = 2;

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

    document.addEventListener('touchstart', function(e) {
        if (!gameStarted) {
            gameStarted = true;
            update();
        }

        var touch = e.touches[0];
        var touchX = touch.clientX;
        var touchY = touch.clientY;

        if (touchX < player.x) {
            moveDirection = 'left';
            player.dx = -1;
        } else if (touchX > player.x + player.size) {
            moveDirection = 'right';
            player.dx = 1;
        }

        if (touchY < player.y) {
            player.dy = -1;
        } else if (touchY > player.y + player.size) {
            player.dy = 1;
        }
    });

    document.addEventListener('touchend', function(e) {
        moveDirection = null;
        player.dx = 0;
        player.dy = 0;
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
        obstacles.push({ x, y, size, color });
    }

    function collisionDetected(rect1, rect2) {
        return rect1.x < rect2.x + rect2.size &&
            rect1.x + rect1.size > rect2.x &&
            rect1.y < rect2.y + rect2.size &&
            rect1.y + rect1.size > rect2.y;
    }

    function resetGame() {
        player.x = canvas.width / 2;
        player.y = canvas.height - 25;
        obstacles = [];
        gameOver = false;
        gameStarted = false;
        timer = 100;
        gameClock = 0;
        waveCountdown = 10;
        waveNumber = 1;
        obstacleSpeed = 2;
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!gameStarted) {
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Tap to start", canvas.width / 2, canvas.height / 2);
            ctx.fillText("Tap left or right of blue square to move", canvas.width / 2, canvas.height / 2 + 30);
            return;
        }

        // Update game clock and wave countdown
        gameClock++;
        if (gameClock % 60 === 0) { // Update every second
            timer--;
            if (timer <= 0) {
                resetGame();
                return;
            }

            waveCountdown--;
            if (waveCountdown <= 0) {
                waveNumber++;
                waveCountdown = 10;
                obstacleSpeed *= 1.1; // Increase obstacle speed by 10% every wave
                obstacles = []; // Clear obstacles for new wave
            }
        }

        // Move player
        player.x += player.dx * player.speed;
        player.y += player.dy * player.speed;

        // Keep player within canvas
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
            obs.y += obstacleSpeed;
            ctx.fillStyle = obs.color;
            ctx.fillRect(obs.x, obs.y, obs.size, obs.size);

            // Collision check
            if (collisionDetected(player, obs)) {
                if (obs.color === "red") {
                    gameOver = true;

                    // Display a random motivational message
                    ctx.fillStyle = "black";
                    ctx.font = "30px Arial";
                    ctx.textAlign = "center";
                    var randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
                    ctx.fillText(randomMessage, canvas.width / 2, canvas.height / 2);

                    setTimeout(resetGame, 2000);
                    return;

                } else if (obs.color === "gold") {
                    timer += 10;
                    obstacles.splice(i, 1);
                    i--;

                } else if (obs.color === "purple") {
                    timer += 5;
                    obstacles.splice(i, 1);
                    i--;
                }
            }

            // Remove obstacles that go off-screen
            if (obs.y > canvas.height) {
                obstacles.splice(i, 1);
                i--;
            }
        }

        // Display timer and wave information
        ctx.fillStyle = "black";
        ctx.font = "18px Arial";
        ctx.textAlign = "right";
        ctx.fillText(`Time: ${timer}s`, canvas.width - 10, 25);
        ctx.fillText(`Wave: ${waveNumber}`, canvas.width - 10, 50);

        // Spawn new obstacles
        if (Math.random() < 0.1 * waveNumber) spawnObstacle(); // Spawn more obstacles with increasing waves

        // Request next animation frame
        if (!gameOver) {
            requestAnimationFrame(update);
        }
    }

    // Start the initial state
    update();
});
